import React from 'react'

export const MinimunSvg: Icon = ({ size, ...attr }) => {
    return (
        <svg
            stroke='currentColor'
            fill='currentColor'
            stroke-width='0'
            viewBox='0 0 256 256'
            height={size}
            width={size}
            {...attr}
            xmlns='http://www.w3.org/2000/svg'
        >
            <path d='M47.51,112.49a12,12,0,0,1,17-17L116,147V32a12,12,0,0,1,24,0V147l51.51-51.52a12,12,0,0,1,17,17l-72,72a12,12,0,0,1-17,0ZM216,204H40a12,12,0,0,0,0,24H216a12,12,0,0,0,0-24Z'></path>
        </svg>
    )
}
