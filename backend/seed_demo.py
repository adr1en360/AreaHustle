import asyncio
import os
import bcrypt
from datetime import datetime
from motor.motor_asyncio import AsyncIOMotorClient
from database import settings

def get_password_hash(password: str) -> str:
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")

async def seed():
    print("Connecting to MongoDB...")
    client = AsyncIOMotorClient(settings.MONGODB_URL)
    db = client[settings.DATABASE_NAME]

    print("Clearing existing users, profiles, transactions, and tasks for clean demo...")
    await db.users.delete_many({"email": {"$in": ["customer@areahustle.com", "hustler@areahustle.com"]}})
    await db.hustler_profiles.delete_many({})
    await db.transactions.delete_many({})
    await db.tasks.delete_many({})

    # 1. Create Customer
    customer_pass = get_password_hash("password123")
    customer = {
        "email": "customer@areahustle.com",
        "hashed_password": customer_pass,
        "role": "customer",
        "name": "Kunle Shonubi",
        "phone_number": "+234 812 345 6789",
        "kyc_tier": 1,
        "kyc_status": "verified",
        "wallet_balance": 150000.0,
        "language_preference": "english",
        "created_at": datetime.utcnow()
    }
    cust_res = await db.users.insert_one(customer)
    customer_id = str(cust_res.inserted_id)
    print(f"Customer created with ID: {customer_id}")

    # 2. Create Hustler
    hustler_pass = get_password_hash("password123")
    hustler = {
        "email": "hustler@areahustle.com",
        "hashed_password": hustler_pass,
        "role": "hustler",
        "name": "Emeka Okafor",
        "phone_number": "+234 809 876 5432",
        "kyc_tier": 2,
        "kyc_status": "verified",
        "wallet_balance": 82000.0,
        "language_preference": "english",
        "created_at": datetime.utcnow()
    }
    hust_res = await db.users.insert_one(hustler)
    hustler_id = str(hust_res.inserted_id)
    print(f"Hustler created with ID: {hustler_id}")

    # 3. Create Hustler Profile
    profile = {
        "user_id": hustler_id,
        "trust_score": 850,
        "completed_jobs": 28,
        "completion_rate": 98.0,
        "on_time_arrival": 96.0,
        "repeat_hire_ratio": 0.68,
        "dispute_rate": 0.01,
        "income_30d": 75000.0,
        "income_60d": 145000.0,
        "income_90d": 210000.0,
        "income_consistency_index": 0.82,
        "platform_tenure_months": 6,
        "service_areas": ["Lekki Phase 1", "Ajah"],
        "categories": ["Generator Service", "Car Wash", "Cleaning"]
    }
    await db.hustler_profiles.insert_one(profile)
    print("Hustler profile created")

    # 4. Insert Past Transactions
    transactions = [
        {
            "user_id": hustler_id,
            "type": "payout",
            "amount": 25000.0,
            "desc": "Generator Maintenance Lekki",
            "location": "Lekki Phase 1",
            "timestamp": datetime.utcnow()
        },
        {
            "user_id": hustler_id,
            "type": "payout",
            "amount": 15000.0,
            "desc": "Premium Sedan Detail",
            "location": "Ajah",
            "timestamp": datetime.utcnow()
        },
        {
            "user_id": hustler_id,
            "type": "payout",
            "amount": 30000.0,
            "desc": "AC Repair & Servicing",
            "location": "Lekki Phase 1",
            "timestamp": datetime.utcnow()
        },
        {
            "user_id": hustler_id,
            "type": "payout",
            "amount": 12000.0,
            "desc": "Water Pump Installation",
            "location": "Sangotedo",
            "timestamp": datetime.utcnow()
        },
        {
            "user_id": hustler_id,
            "type": "payout",
            "amount": 22000.0,
            "desc": "Residential Gate Painting",
            "location": "Lekki Phase 1",
            "timestamp": datetime.utcnow()
        },
        {
            "user_id": hustler_id,
            "type": "payout",
            "amount": 8000.0,
            "desc": "Microwave Diagnostic & Repair",
            "location": "Ajah",
            "timestamp": datetime.utcnow()
        }
    ]
    await db.transactions.insert_many(transactions)
    print("Seed transactions inserted")

    # 5. Insert Open, Matched and Active tasks for feed
    tasks = [
        {
            "customer_id": customer_id,
            "title": "AC Installation & Leak Repair",
            "category": "Minor Repairs",
            "description": "Urgent installation of 2 split AC units and fixing water leakage in the living room.",
            "budget": 25000.0,
            "neighbourhood": "Lekki Phase 1",
            "status": "open",
            "created_at": datetime.utcnow()
        },
        {
            "customer_id": customer_id,
            "title": "Home Deep Cleaning",
            "category": "Cleaning",
            "description": "Standard 3 bedroom flat deep cleaning, dusting, and floor polishing.",
            "budget": 18000.0,
            "neighbourhood": "Ajah",
            "status": "open",
            "created_at": datetime.utcnow()
        },
        {
            "customer_id": customer_id,
            "title": "Generator Oil Change & Filters",
            "category": "Generator Service",
            "description": "Perform basic servicing and replacement of oil filters for a 15kVA soundproof generator.",
            "budget": 15000.0,
            "neighbourhood": "Lekki Phase 1",
            "status": "matched",
            "matched_hustler_id": hustler_id,
            "created_at": datetime.utcnow()
        },
        {
            "customer_id": customer_id,
            "title": "SUV Exterior Polish",
            "category": "Car Wash",
            "description": "Premium buffing, polishing, and detailing service for a black Prado SUV.",
            "budget": 20000.0,
            "neighbourhood": "Ajah",
            "status": "active",
            "matched_hustler_id": hustler_id,
            "created_at": datetime.utcnow()
        },
        {
            "customer_id": customer_id,
            "title": "Inverter Battery Swap",
            "category": "Minor Repairs",
            "description": "Disconnect old batteries and hook up 4 new 200Ah deep cycle tubular batteries.",
            "budget": 10000.0,
            "neighbourhood": "Lekki Phase 1",
            "status": "open",
            "created_at": datetime.utcnow()
        }
    ]
    await db.tasks.insert_many(tasks)
    print("Demo tasks seeded successfully!")

if __name__ == "__main__":
    asyncio.run(seed())
