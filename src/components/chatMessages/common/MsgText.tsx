import React from 'react'

interface LeftTextMsgProps {
    message: string
    className: string
}

const MsgText: React.FC<LeftTextMsgProps> = ({ message, className }) => {
    return (
        <div className={'flex flex-row px-6 py-3 ' + className}>
            <span className={'text-sm font-semibold break-all'}>
                {message.split('\n').map((line, index) => (
                    <p key={index}>{line}</p>
                ))}
            </span>
        </div>
    )
}

export default MsgText
