from fastapi import FastAPI
from routes import tasks, users, passport
from database import init_db

app = FastAPI(title="AreaHustle API", version="3.0")

@app.on_event("startup")
async def startup_event():
    await init_db()

app.include_router(tasks.router, prefix="/api/v1/tasks", tags=["Tasks"])
app.include_router(users.router, prefix="/api/v1/users", tags=["Users"])
app.include_router(passport.router, prefix="/api/v1/passport", tags=["Passport"])

@app.get("/")
async def root():
    return {"message": "Welcome to AreaHustle API v3.0"}
