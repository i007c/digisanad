
from sqlalchemy import insert, select, update

from shared import sqlx

from .models import UserModel, UserTable


async def user_get(*where) -> UserModel | None:
    row = await sqlx.fetch_one(select(UserTable).where(*where))
    if row is None:
        return None

    return UserModel(**row)


async def user_update(*where, **values: dict):
    await sqlx.execute(
        update(UserTable).where(*where),
        values
    )


async def user_add(**values: dict) -> int:
    return await sqlx.execute(insert(UserTable), values)


async def user_count() -> int:
    query = 'SELECT COUNT(0) from user'
    return await sqlx.fetch_one(query)[0]


async def user_get_all(limit: int, offset: int):
    return await sqlx.fetch_all(select(UserTable).limit(limit).offset(offset))