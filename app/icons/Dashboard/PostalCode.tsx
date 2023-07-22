import React from 'react'

const PostalCodeSvg: Icon = ({ size, ...attr }) => {
    return (
        <svg
            stroke='currentColor'
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
                <path d='M18.364 17.364L12 23.728l-6.364-6.364a9 9 0 1 1 12.728 0zM12 15a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm0-2a2 2 0 1 1 0-4 2 2 0 0 1 0 4z'></path>
            </g>
        </svg>
    )
}

export default PostalCodeSvg
