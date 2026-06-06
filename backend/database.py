import os
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    MONGODB_URL: str = "mongodb://localhost:27017"
    DATABASE_NAME: str = "areahustle"
    AETHEX_API_KEY: str = ""
    AETHEX_BASE_URL: str = "https://api.aethexai.com/api/v1"
    AETHEX_PASSPORT_AGENT_ID: str = ""
    GEMINI_API_KEY: str = ""
    AETHEX_FROM_NUMBER: str = ""
    AH_CALLBACK_URL: str = ""

    model_config = SettingsConfigDict(
        env_file=".env",
        extra="ignore"
    )

settings = Settings()

client = AsyncIOMotorClient(settings.MONGODB_URL)
db = client[settings.DATABASE_NAME]

async def init_db():
    # Tasks: Filter by neighbourhood and category
    await db.tasks.create_index([("neighbourhood", 1), ("category", 1)])
    # Hustler Profiles: Filter by service_areas and trust_score
    await db.hustler_profiles.create_index([("service_areas", 1), ("trust_score", -1)])
    # Users: Unique email
    await db.users.create_index("email", unique=True)
    # Transactions: user_id + type index
    await db.transactions.create_index([("user_id", 1), ("timestamp", -1)])

async def get_database():
    return db
