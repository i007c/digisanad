import React, { FC, useEffect } from 'react'

import { CountAnim } from '@00-team/utils'

import { EditSvg } from 'Icons'
import { SendSvg } from 'Icons/Actions/Send'

import { useAtomValue, useSetAtom } from 'jotai'
import { UserAtom } from 'state'

import walletSvg from 'static/Dashboard/wallet.svg'

import { Submit } from 'components'

import { LogoutButton } from './LogoutButton'

import './style/dashboard.scss'

import DEFAULT_IMG from 'static/avatar.png'

const Dashboard: FC = () => {
    const UpdateUser = useSetAtom(UserAtom)

    useEffect(() => {
        // TODO: update this
        UpdateUser({
            token: '1:Tfz3)5JgDiJn3*w%T*NH7[LrmKASiLKW)6jeR#liYYZ1$ghvJjH%y*@I^EgQvo$oJ(Tal',
        })

        UpdateUser('fetch')
    }, [])

    return (
        <section className='dashboard-container'>
            <Profile />
            <Options />
            <Wallet />
            <div className='div4 default'></div>
            <div className='div5 default'></div>
            <div className='div6 default'></div>
        </section>
    )
}

export default Dashboard

const Profile: FC = () => {
    const User = useAtomValue(UserAtom)

    return (
        <div className='profile default'>
            <img
                className='profile-img'
                src={User.picture || DEFAULT_IMG}
            ></img>
            <div className='profile-content title'>
                <div className='holder'>{User.nickname || '---'}</div>
                <div className='update-profile icon'>
                    <EditSvg />
                </div>
            </div>
        </div>
    )
}

const Options = () => {
    return (
        <div className='options default title'>
            <div className='column-wrapper'>
                <div className='column'>
                    <div className='holder-icon icon'>
                        <DefaultSvg />
                    </div>
                    <div className='holder-text '>لورم ایپسوم</div>
                </div>
                <div className='send-icon icon'>
                    <SendSvg />
                </div>
            </div>
            <div className='column-wrapper'>
                <div className='column'>
                    <div className='holder-icon icon'>
                        <DefaultSvg />
                    </div>
                    <div className='holder-text '>لورم ایپسوم</div>
                </div>
                <div className='send-icon icon'>
                    <SendSvg />
                </div>
            </div>
            <div className='column-wrapper'>
                <div className='column'>
                    <div className='holder-icon icon'>
                        <DefaultSvg />
                    </div>
                    <div className='holder-text '>لورم ایپسوم</div>
                </div>
                <div className='send-icon icon'>
                    <SendSvg />
                </div>
            </div>
            <LogoutButton />
        </div>
    )
}

const Wallet: FC = () => {
    const User = useAtomValue(UserAtom)

    return (
        <div className='wallet default'>
            <div className='wallet-wrapper'>
                <div className='wallet-content'>
                    <div className='title money-balance'>
                        <div className='holder'>موجودی شما:</div>{' '}
                        <div className='data'>
                            <CountAnim end={User.wallet} />
                        </div>
                    </div>
                    <div className='title_smaller charge'>
                        تنها در چند ثانیه موجودی خود را افزایش دهید.
                    </div>
                    <div className='charge-btn'></div>
                </div>
                <object
                    className='svg-container'
                    data={walletSvg}
                    type=''
                ></object>
            </div>
            <Submit title='افزایش موجودی' className='title_smaller' />
        </div>
    )
}

const DefaultSvg: FC = () => (
    <svg
        stroke='currentColor'
        fill='currentColor'
        strokeWidth='0'
        viewBox='0 0 24 24'
        height='1em'
        width='1em'
        xmlns='http://www.w3.org/2000/svg'
    >
        <g>
            <path fill='none' d='M0 0h24v24H0z'></path>
            <circle cx='12' cy='12' r='10'></circle>
        </g>
    </svg>
)