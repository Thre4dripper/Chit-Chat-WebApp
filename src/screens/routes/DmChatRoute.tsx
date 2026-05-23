import React, { useEffect } from 'react'
import { useParams } from 'react-router'
import useChatDetailsStore from '../../store/chat.details.store.ts'
import ChattingFragment from '../../fragments/home/ChattingFragment.tsx'
import { ChatType } from '../../enums/ChatType.ts'

const DmChatRoute: React.FC = () => {
    const { chatId } = useParams<{ chatId: string }>()
    const setCurrentChatId = useChatDetailsStore((state) => state.setCurrentChatId)

    useEffect(() => {
        if (chatId) setCurrentChatId(chatId, ChatType.USER)
    }, [chatId, setCurrentChatId])

    return <ChattingFragment />
}

export default DmChatRoute
