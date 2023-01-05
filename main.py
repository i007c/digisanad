
from fastapi import APIRouter, FastAPI
from fastapi.routing import APIRoute

from database import database, redis
from modules import auth, user

# TODO: make the doc
app = FastAPI(
    # title='DigiSanad',
    # version='0.0.1',
    # description='**DigiSanad api documents**',

    # openapi_url=None
)

api = APIRouter(
    prefix='/api',
)


@app.on_event('startup')
async def startup():
    await redis.ping()
    await database.connect()


@app.on_event('shutdown')
async def shutdown():
    await redis.connection_pool.disconnect()
    await database.disconnect()


api.include_router(auth.router)
api.include_router(user.router)

app.include_router(api)


for route in app.routes:
    if isinstance(route, APIRoute):
        route.operation_id = route.name
