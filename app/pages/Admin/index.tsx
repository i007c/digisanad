import React, { FC } from 'react'

import { ContractSvg, SettingSvg } from 'icons'

import './style/admin.scss'

const Admin: FC = () => {
    return (
        <main className='admin-container'>
            <Sidebar />
            <aside className='admin-wrapper'></aside>
        </main>
    )
}

const Sidebar: FC = () => {
    return (
        <aside className='admin-sidebar'>
            <div className='sidebar-wrapper'>
                <SidebarRow
                    title='تنظیمات'
                    className='setting'
                    Icon={SettingSvg}
                />
                <SidebarRow
                    title='قراردادها'
                    className='contract'
                    Icon={ContractSvg}
                />
            </div>
        </aside>
    )
}

interface SidebarRowProps {
    title: string
    Icon: Icon
    className?: string
}

const SidebarRow: FC<SidebarRowProps> = ({ Icon, title, className }) => {
    return (
        <div className={`sidebar-row title_small ${className && className}`}>
            <div className='icon'>
                <Icon size={25} />
            </div>
            <div className='holder'>{title}</div>
            <div></div>
        </div>
    )
}

export default Admin
