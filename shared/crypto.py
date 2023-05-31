
import json

from db.models import WalletModel
from shared import W3, settings
from shared.tools import now


def get_abi(name: str) -> list:
    path = settings.base_dir / f'shared/abi/{name}.json'
    with open(path) as f:
        return json.load(f)


ETH_WEI = 1e18
ETH_GWEI = 1e9
ETH_TOKENS = {
    'usdt': {
        'name': 'Tether USD',
        'contract': W3.eth.contract(
            '0xdAC17F958D2ee523a2206206994597C13D831ec7',
            abi=get_abi('usdt')
        )
    }
}


async def update_wallet(wallet: WalletModel = None) -> WalletModel:
    if wallet is None:
        acc = W3.eth.account.create()
    else:
        acc = W3.eth.account.from_key(wallet.eth_pk)

    eth_balance = await W3.eth.get_balance(acc.address)
    tokens = {}

    for k, t in ETH_TOKENS.items():
        tokens[k] = await t['contract'].functions.balanceOf(acc.address).call()

    if wallet is None:
        return WalletModel(
            wallet_id=0,
            user_id=0,
            last_update=now(),
            eth_pk=acc.key.hex(),
            eth_addr=acc.address,
            eth_balance=eth_balance,
            eth_tokens=tokens
        )

    wallet.last_update = now()
    wallet.eth_balance = eth_balance
    wallet.eth_tokens = tokens
    wallet.eth_pk = acc.key.hex()
    wallet.eth_addr = acc.address

    return wallet


__all__ = [
    'ETH_WEI', 'ETH_GWEI', 'ETH_TOKENS',
    'update_wallet'
]