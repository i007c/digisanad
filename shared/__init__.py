import sqlite3
from pathlib import Path
from string import ascii_letters, digits

from databases import Database
from pydantic import BaseSettings
from redis.asyncio import Redis
from web3 import AsyncHTTPProvider, AsyncWeb3


class Connection(sqlite3.Connection):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.execute('pragma foreign_keys=1')


class Settings(BaseSettings):
    version: str = '0.0.1-beta'

    base_dir: Path = Path(__file__).parent.parent

    sql_dir: Path = base_dir / 'db/files/'
    sql_url: str = 'sqlite:///' + str(sql_dir / 'main.db')

    redis_pass: str
    infura_token: str
    meilisms_tokne: str

    verification_expire = 2 * 60
    verification_code_len = 5

    token_len = 69
    token_abc = ascii_letters + digits + ('!@#$%^&*_+' * 2)

    update_wallet_timeout = 5 * 60


settings = Settings(_env_file='.secrets')
settings.sql_dir.mkdir(parents=True, exist_ok=True)

(settings.base_dir / 'db/versions').mkdir(parents=True, exist_ok=True)

W3 = AsyncWeb3(AsyncHTTPProvider(
    'https://mainnet.infura.io/v3/' + settings.infura_token
))

redis = Redis(
    password=settings.redis_pass,
    unix_socket_path='/run/redis/digisanad.sock'
)

sqlx = Database(settings.sql_url, factory=Connection)
