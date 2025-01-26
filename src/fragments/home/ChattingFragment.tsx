import React from 'react'
import ChatInput from '../../components/chat/ChatInput.tsx'
import ChatHeader from '../../components/chat/ChatHeader.tsx'
import ChatBox from '../../components/chat/ChatBox.tsx'
import AddChatsFragment from '../profile/AddChatsFragment.tsx'
const ChattingFragment: React.FC = () => {
    const chats: number[] = []

    if (chats.length === 0) {
        return <AddChatsFragment />
    }
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
