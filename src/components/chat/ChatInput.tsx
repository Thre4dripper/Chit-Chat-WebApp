import React, { useState } from 'react'
import { IconButton, TextareaAutosize } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import SendIcon from '@mui/icons-material/Send'
import useChatDetailsStore from '../../store/chat.details.store.ts'
import useLocalStore from '../../store/local.store.ts'

const ChatInput: React.FC = () => {
    const [message, setMessage] = useState('')
    const sendMessage = useChatDetailsStore((state) => state.sendTextMessage)
    const chatDetails = useChatDetailsStore((state) => state.chatDetails)
    const username = useLocalStore((state) => state.username)
    if (!chatDetails) return <></>

    const handleSendMessage = () => {
        if (message.trim() === '') return
        if (!username) return

        const from = username
        const to =
            chatDetails.dmChatUser1.username === username
                ? chatDetails.dmChatUser2.username
                : chatDetails.dmChatUser1.username

        sendMessage(chatDetails, message, from, to)
    }

    const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault()
            // Handle sending the message here, e.g., sendMessage(inputValue);
            handleSendMessage()
            setMessage('')
        }
    }

    return (
        <div
            className={
                'bg-slate-300 rounded-bl-3xl rounded-br-3xl flex flex-row gap-2 items-center px-4 py-2'
            }>
            <IconButton>
                <AddIcon className={'text-gray-700'} />
            </IconButton>
            <div className={'flex flex-row flex-auto rounded-lg overflow-hidden'}>
                <TextareaAutosize
                    className={
                        'w-full p-3 text-white text-sm font-normal bg-slate-700 resize-none focus:outline-none rounded-lg ' +
                        'scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-slate-700 scrollbar-thumb-rounded-full scrollbar-track-rounded-full'
                    }
                    placeholder={'Type a message...'}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={handleKeyDown}
                    minRows={1}
                    maxRows={4}
                />
            </div>
            <IconButton onClick={handleSendMessage}>
                <SendIcon className={'text-gray-700'} />
            </IconButton>
        </div>
    )
}

export default ChatInput
