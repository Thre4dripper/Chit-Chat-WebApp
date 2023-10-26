import React from 'react'

interface LeftTextMsgProps {
    message: string
}

const LeftText: React.FC<LeftTextMsgProps> = ({ message }) => {
    return (
        <div
            className={
                'flex-none bg-slate-300/50 shadow-slate-950/20 shadow-md ' +
                'max-w-[36rem] w-full ' +
                'rounded-tl-3xl rounded-bl-lg rounded-br-3xl rounded-tr-3xl'
            }>
            <div className={'flex flex-row px-6 py-3'}>
                <span className={'text-black/80 text-sm'}>{message}</span>
            </div>
        </div>
    )
}

export default LeftText