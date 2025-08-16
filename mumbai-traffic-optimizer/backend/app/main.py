from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from .api.routes import router as api_router
from .utils.db import init_db, get_session
from .services.data_collector import start_scheduler


def create_app() -> FastAPI:
    app = FastAPI(title="TrafficIQ - Mumbai Traffic Optimization Engine", version="0.1.0")

    origins = [
        "http://localhost",
        "http://localhost:3000",
        "http://localhost:5173",
        "*",
    ]

    app.add_middleware(
        CORSMiddleware,
        allow_origins=origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    @app.on_event("startup")
    async def startup_event():
        init_db()
        start_scheduler(app)

    app.include_router(api_router, prefix="/api")
    return app


app = create_app()
