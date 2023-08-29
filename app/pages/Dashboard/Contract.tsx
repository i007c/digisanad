import React, { Dispatch, SetStateAction, FC, useEffect, useState } from 'react'

import { C } from '@00-team/utils'

import axios from 'axios'
import { CopyIcon } from 'icons'
import { SchemaData } from 'pages/schema/types'
import { Viewer } from 'pages/schema/viewer'
import { useNavigate, useParams } from 'react-router-dom'

import { useAtomValue } from 'jotai'
import { TokenAtom, UserAtom } from 'state'

import './style/contract.scss'

const CSMAP = {
    draft: 'در حال تکمیل',
    action: 'در حال انجام',
    done: 'انجام شده',
} as const

type SchemaModel = {
    schema_id: number
    draft: boolean
    title: string
    description: string
    data: SchemaData
    creator: number
}

type ContractModel = {
    contract_id: number
    creator: number
    title: string
    stage: keyof typeof CSMAP
    start_date: number
    finish_date: number
    pepper: string
    disable_invites: boolean
}

type Parties = {
    user_id: number
    phone: string
    first_name: string
    last_name: string
}[]

type State = ContractModel & {
    data: SchemaData
    parties: Parties
    page: number
    need_schema: boolean
}

type SaveData = {
    data: SchemaData
    stage: keyof typeof CSMAP
    title: string
    disable_invites: boolean
}

const Contract: FC = () => {
    const { contract_id } = useParams()
    const navigate = useNavigate()
    const token = useAtomValue(TokenAtom)
    const me = useAtomValue(UserAtom)

    const [state, setState] = useState<State>({
        title: '',
        stage: 'draft',
        data: {
            pages: [],
            fields: {},
        },
        page: 0,
        contract_id: -1,
        pepper: '',
        creator: -1,
        parties: [],
        start_date: 0,
        finish_date: 0,
        disable_invites: true,
        need_schema: true,
    })
    // const update = () => setState(s => ({ ...s }))
    const updateState = (v: Partial<State>) => setState(s => ({ ...s, ...v }))

    const fetch_contract = async () => {
        try {
            const response = await axios.get(`/api/contracts/${contract_id}/`, {
                headers: { Authorization: 'Bearer ' + token },
            })

            if (response.status != 200) {
                return navigate('/dashboard/contracts/')
            }

            try {
                let cdata = response.data.data
                response.data.need_schema =
                    !Object.keys(cdata).length ||
                    ('fields' in cdata && !Object.keys(cdata).length) ||
                    ('pages' in cdata && !cdata.pages.length)
            } catch {}

            updateState(response.data)
        } catch {
            navigate('/dashboard/contracts/')
        }
    }

    const fetch_parties = async () => {
        try {
            const response = await axios.get(
                `/api/contracts/${contract_id}/parties/`,
                {
                    headers: { Authorization: 'Bearer ' + token },
                }
            )

            updateState({ parties: response.data })
        } catch {}
    }

    const remove_user = async (user_id: number): Promise<boolean> => {
        try {
            const response = await axios.delete(
                `/api/contracts/${contract_id}/remove/${user_id}/`,
                {
                    headers: { Authorization: 'Bearer ' + token },
                }
            )

            return response.data.ok
        } catch {}

        return false
    }

    const save_contract = async (data: Partial<SaveData>) => {
        await axios.patch(`/api/contracts/${contract_id}/`, data, {
            headers: {
                Authorization: 'Bearer ' + token,
            },
        })
    }

    useEffect(() => {
        if (!contract_id) return navigate('/dashboard/contracts/')
        let cid = parseInt(contract_id)
        if (isNaN(cid)) return navigate('/dashboard/contracts/')

        fetch_contract()
        fetch_parties()
    }, [contract_id])

    if (state.contract_id == -1) return <></>

    if (state.need_schema)
        return <SelectSchema state={state} setState={setState} />

    return (
        <div className='contract-container'>
            <div className='head'>
                <h1 className='title'>{state.title}</h1>
                <div className='actions'>
                    {state.data.pages.map((_, i) => (
                        <button
                            key={i}
                            className={`${C(
                                i == state.page
                            )} pager title_smaller`}
                            onClick={() =>
                                state.page != i && updateState({ page: i })
                            }
                        >
                            {i + 1}
                        </button>
                    ))}
                    <button
                        className='copy-btn cta-btn title_smaller'
                        onClick={() => save_contract({ data: state.data })}
                    >
                        <CopyIcon size={25} />
                        ذخیره
                    </button>
                </div>
            </div>
            <div className='inner-wrapper'>
                <div className='viewer-wrapper'>
                    <Viewer
                        page={state.page}
                        schema={state.data}
                        setUID={() => {}}
                        setSchema={data =>
                            setState(s => ({
                                ...s,
                                data: { ...s.data, ...data },
                            }))
                        }
                    />
                </div>

                <div className='parties'>
                    <div className='users'>
                        {state.parties.map((user, i) => (
                            <div key={i}>
                                <span>
                                    {user.first_name} {user.last_name}
                                </span>
                                {state.creator == me.user_id &&
                                    user.user_id != me.user_id && (
                                        <button
                                            onClick={() => {
                                                remove_user(user.user_id).then(
                                                    ok => {
                                                        if (ok) fetch_parties()
                                                    }
                                                )
                                            }}
                                        >
                                            X
                                        </button>
                                    )}
                            </div>
                        ))}
                    </div>
                    <div className='config'>
                        <button
                            className='toggle-invites'
                            style={{
                                '--color': state.disable_invites
                                    ? 'red'
                                    : 'green',
                            }}
                            onClick={() => {
                                setState(s => {
                                    save_contract({
                                        disable_invites: !s.disable_invites,
                                    }).then(() => fetch_contract())
                                    return {
                                        ...s,
                                        disable_invites: !s.disable_invites,
                                    }
                                })
                            }}
                        >
                            دعوت: {state.disable_invites ? 'غیرفعال' : 'فعال'}
                        </button>
                        <div className='link'>
                            <input
                                value={`${location.origin}/jc/${state.contract_id}:${state.pepper}`}
                                onChange={() => {}}
                            />
                            <button>
                                <CopyIcon />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

type CommonProps = {
    state: State
    setState: Dispatch<SetStateAction<State>>
}

const SelectSchema: FC<CommonProps> = ({ setState }) => {
    const token = useAtomValue(TokenAtom)
    const [page, setPage] = useState(0)
    const [max_page, setMaxPage] = useState(-1)
    const [schemas, setSchemas] = useState<SchemaModel[]>([])

    const fetch_schemas = async (page: number) => {
        try {
            const response = await axios.get(`/api/schemas/?page=${page}`, {
                headers: { Authorization: 'Bearer ' + token },
            })

            if (page && !response.data.length) {
                setPage(page - 1)
                setMaxPage(page - 1)
                return
            }

            setSchemas(response.data)
        } catch {}
    }

    useEffect(() => {
        fetch_schemas(page)
    }, [page])

    return (
        <div className='schema-list'>
            <h1 className='title'>قالب قرار خود را انتخاب کنید</h1>
            <div className='schemas'>
                {schemas.map(s => (
                    <div className='schema' key={s.schema_id}>
                        <h2 className='title'>{s.title}</h2>
                        <p>{s.description}</p>
                        <button
                            onClick={() =>
                                setState(ss => ({
                                    ...ss,
                                    data: s.data,
                                    title: s.title,
                                    need_schema: false,
                                }))
                            }
                        >
                            انتخاب
                        </button>
                    </div>
                ))}
            </div>
            <div className='actions'>
                <div className='pagination'>
                    <button
                        disabled={max_page == page}
                        onClick={() => setPage(s => s + 1)}
                    >
                        صفحه بعدی
                    </button>
                    <button
                        disabled={page == 0}
                        onClick={() => setPage(s => Math.max(0, s - 1))}
                    >
                        صفحه قبلی
                    </button>
                </div>
            </div>
        </div>
    )
}

const JoinContract = () => {
    const { id_pepper } = useParams()
    const token = useAtomValue(TokenAtom)
    const navigate = useNavigate()

    const join = async (cid: string, pepper: string) => {
        try {
            const response = await axios.get(
                `/api/contracts/${cid}/join/${pepper}/`,
                {
                    headers: { Authorization: 'Bearer ' + token },
                }
            )

            if (response.data.ok) {
                navigate('/dashboard/contract/' + cid)
            } else {
                navigate('/dashboard/')
            }
        } catch {
            navigate('/dashboard/')
        }
    }

    useEffect(() => {
        if (!id_pepper || id_pepper.indexOf(':') == -1)
            return navigate('/dashboard/')

        let [cid, pepper] = id_pepper.split(':') as [string, string]
        if (!cid || !pepper || isNaN(parseInt(cid)))
            return navigate('/dashboard/')

        join(cid, pepper)
    }, [id_pepper])

    return (
        <div className='join-contract'>
            <div className='inner'>در حال ورود به قرارداد ...</div>
        </div>
    )
}

export { Contract, JoinContract }