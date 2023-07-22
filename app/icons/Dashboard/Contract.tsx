import React from 'react'

export const ContractSvg: Icon = ({ size, ...attr }) => (
    <svg
        stroke='black'
        fill='currentColor'
        strokeWidth='0'
        viewBox='0 0 24 24'
        height={size}
        width={size}
        {...attr}
        xmlns='http://www.w3.org/2000/svg'
    >
        <g>
            <path fill='none' d='M0 0h24v24H0z'></path>
            <path d='M20 2a3 3 0 0 1 3 3v2h-2v12a3 3 0 0 1-3 3H4a3 3 0 0 1-3-3v-2h16v2a1 1 0 0 0 .883.993L18 20a1 1 0 0 0 .993-.883L19 19v-4H3V5a3 3 0 0 1 3-3h14z'></path>
        </g>
    </svg>
)
