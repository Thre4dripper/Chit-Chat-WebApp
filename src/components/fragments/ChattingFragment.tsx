import React from 'react'
import ChatInput from '../ChatInput.tsx'
import ChatHeader from '../ChatHeader.tsx'
import ChatBox from '../ChatBox.tsx'

const ChattingFragment: React.FC = () => {
    return (
        <div
            className={
                'bg-blue-50 h-screen rounded-tl-3xl rounded-bl-3xl rounded-tr-3xl rounded-br-3xl'
            }>
            <div className={'flex flex-col h-screen'}>
                {/*Header section*/}
                <ChatHeader />
                {/*Chatting section*/}
                <ChatBox />
                {/*Input section*/}
                <ChatInput />
            </div>
        </div>
    )
}

export default ChattingFragment
