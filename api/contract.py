
import json
from sqlite3 import IntegrityError

from fastapi import APIRouter, Request
from pydantic import BaseModel

from db.contract import contract_add, contract_get, contract_update
from db.contract import contract_user_add, contract_user_delete
from db.models import ContractModel, ContractStage, ContractTable
from db.models import ContractUserTable, UserModel, UserPublic
from db.user import user_public
from deps import user_required
from shared import settings, sqlx
from shared.errors import bad_args, bad_id, closed_contract, no_change
from shared.models import IDModel, OkModel
from shared.tools import random_string, utc_now

router = APIRouter(
    prefix='/contracts',
    tags=['contract'],
    dependencies=[user_required()]
)


@router.get('/', response_model=list[ContractModel])
async def get_contracts(request: Request, page: int = 0):
    user: UserModel = request.state.user

    rows = await sqlx.fetch_all(
        f'''
        SELECT * FROM {ContractUserTable.__tablename__}
        WHERE user = :user_id
        ORDER BY cuid DESC
        LIMIT {settings.page_size} OFFSET :skip
        ''',
        {
            'user_id': user.user_id,
            'skip': page * settings.page_size
        },
    )

    cids = '(' + ','.join((str(r[1]) for r in rows)) + ')'

    rows = await sqlx.fetch_all(f'''
        SELECT * from {ContractTable.__tablename__}
        WHERE contract_id in {cids}
    ''')

    result = []
    for row in rows:
        args = row._asdict()
        args['data'] = json.loads(args['data'])
        result.append(ContractModel(**args))

    return result


class CreateBody(BaseModel):
    data: dict


@router.post('/', response_model=IDModel)
async def create(request: Request, body: CreateBody):
    user: UserModel = request.state.user

    contract_id = await contract_add(
        creator=user.user_id,
        stage=ContractStage.DRAFT,
        data=body.data,
        start_date=utc_now(),
        finish_date=0,
        pepper=random_string()
    )

    await contract_user_add(contract_id, user.user_id)

    return {'id': contract_id}


class UpdateBody(BaseModel):
    data: dict = None
    disable_invites: bool = None
    stage: ContractStage = None


@router.patch(
    '/{contract_id}/', response_model=OkModel,
    openapi_extra={'errors': [bad_id, no_change]}
)
async def update(request: Request, contract_id: int, body: UpdateBody):
    user: UserModel = request.state.user
    change = False
    patch = {}

    contract = await contract_get(
        ContractTable.contract_id == contract_id,
        ContractTable.creator == user.user_id
    )
    if contract is None:
        raise bad_id('Contract', contract_id, id=contract_id)

    if contract.stage != ContractStage.DRAFT:
        raise closed_contract

    if (
        body.disable_invites is not None and
        body.disable_invites != contract.disable_invites
    ):
        change = True
        patch['disable_invites'] = body.disable_invites

    if body.stage and body.stage != contract.stage:
        change = True
        patch['stage'] = body.stage
        patch['disable_invites'] = True

        if body.stage == ContractStage.DONE:
            patch['finish_date'] = utc_now()

    if body.data is not None:
        change = True
        patch['data'] = body.data

    if change is False:
        raise no_change

    await contract_update(
        ContractTable.contract_id == contract_id,
        **patch
    )

    return {'ok': True}


@router.get(
    '/{contract_id}/parties/', response_model=list[UserPublic],
    openapi_extra={'errors': [bad_id]}
)
async def contract_parties(request: Request, contract_id: int):
    user: UserModel = request.state.user

    contract = await contract_get(ContractTable.contract_id == contract_id)
    if contract is None:
        raise bad_id('Contract', contract_id, id=contract_id)

    rows = await sqlx.fetch_all(
        f'''
        SELECT * FROM {ContractUserTable.__tablename__}
        WHERE contract = :contract_id
        ''',
        {'contract_id': contract_id},
    )

    user_ids = set((r[2] for r in rows))
    if contract.creator != user.user_id and user.user_id not in user_ids:
        raise bad_id('Contract', contract_id, id=contract_id)

    users = await user_public(user_ids)
    users.pop(-1, None)

    return list(users.values())


async def contract_join(user_id: int, id_pepper: str) -> bool:
    if id_pepper.find(':') == -1:
        return False

    contract_id, pepper = id_pepper.split(':')

    try:
        contract_id = int(contract_id)
    except Exception:
        return False

    contract = await contract_get(
        ContractTable.contract_id == contract_id,
        ContractTable.pepper == pepper,
    )
    if contract is None:
        return False

    if contract.disable_invites or contract.stage != ContractStage.DRAFT:
        return False

    try:
        await contract_user_add(contract_id, user_id)
        return True
    except IntegrityError:
        return False


@router.get('/{contract_id}/join/{pepper}/', response_model=OkModel)
async def join(request: Request, contract_id: int, pepper: str):
    user: UserModel = request.state.user

    return {
        'ok': await contract_join(user.user_id, f'{contract_id}:{pepper}')
    }


@router.delete(
    '/{contract_id}/remove/{user_id}/', response_model=OkModel,
    openapi_extra={'errors': [bad_id, closed_contract, bad_args]}
)
async def remove_user(request: Request, contract_id: int, user_id: int):
    user: UserModel = request.state.user

    if user.user_id == user_id:
        raise bad_args

    contract = await contract_get(
        ContractTable.contract_id == contract_id,
        ContractTable.creator == user.user_id
    )
    if contract is None:
        raise bad_id('Contract', contract_id, id=contract_id)

    if contract.stage != ContractStage.DRAFT:
        raise closed_contract

    return {
        'ok': bool(await contract_user_delete(
            ContractUserTable.contract == contract_id,
            ContractUserTable.user == user_id,
        ))
    }