import React from 'react'

const CodeEnter = () => {
    return (
        <div className='input-wrapper title'>
            <div className='placeholder'>
                <div className='icon'>
                    <SubmitCode />
                </div>
                <div className='holder'>کد تایید</div>
            </div>
            <input
                autoComplete='new-password'
                className='input title_smaller'
                name='phonenumber'
                autoFocus
                type={'tel'}
                id='phonenumber'
                placeholder='09121111111'
            />
        </div>
    )
}

export default CodeEnter

const SubmitCode = () => (
    <svg
        stroke='currentColor'
        fill='currentColor'
        strokeWidth='0'
        viewBox='0 0 512 512'
        height={20}
        width={20}
        xmlns='http://www.w3.org/2000/svg'
    >
        <path d='M249.2 224c-14.2-40.2-55.1-72-100.2-72-57.2 0-101 46.8-101 104s45.8 104 103 104c45.1 0 84.1-31.8 98.2-72H352v64h69.1v-64H464v-64H249.2zm-97.6 66.5c-19 0-34.5-15.5-34.5-34.5s15.5-34.5 34.5-34.5 34.5 15.5 34.5 34.5-15.5 34.5-34.5 34.5z'></path>
    </svg>
)