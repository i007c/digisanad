
from enum import Enum, auto

from pydantic import BaseModel
from sqlalchemy import Column, ForeignKey, Integer, String, text

from shared import settings
from shared.tools import utc_now

from .common import BaseTable, NetworkType
from .user import UserTable


class TransactionTable(BaseTable):
    __tablename__ = 'transactions'

    transaction_id = Column(
        Integer, primary_key=True,
        index=True, autoincrement=True
    )
    transaction_hash = Column(String, nullable=False)
    network = Column(Integer, nullable=False)

    sender = Column(
        'sender', Integer,
        ForeignKey(UserTable.user_id, ondelete='CASCADE'),
        nullable=False, index=True, server_default=text('-1')
    )
    receiver = Column(
        'receiver', Integer,
        ForeignKey(UserTable.user_id, ondelete='CASCADE'),
        nullable=False, index=True, server_default=text('-1')
    )
    network = Column(Integer, nullable=False)
    status = Column(Integer, nullable=False, server_default=text('0'))
    amount = Column(Integer, nullable=False)
    last_update = Column(Integer, nullable=False, server_default=text('0'))
    timestamp = Column(Integer, nullable=False, server_default=text('0'))


class TransactionStatus(int, Enum):
    UNKNOWN = 0
    PENDING = auto()
    SUCCESS = auto()
    FAILURE = auto()


class TransactionModel(BaseModel):
    transaction_id: int
    transaction_hash: str
    network: NetworkType
    sender: int
    receiver: int
    amount: int
    status: TransactionStatus
    last_update: int
    timestamp: int

    @property
    def next_update(self) -> int:
        return (
            (self.last_update + settings.update_transaction_timeout)
            - utc_now()
        )
