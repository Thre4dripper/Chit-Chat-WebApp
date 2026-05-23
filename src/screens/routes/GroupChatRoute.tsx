import React, { useEffect } from 'react'
import { useParams } from 'react-router'
import useChatDetailsStore from '../../store/chat.details.store.ts'
import ChattingFragment from '../../fragments/home/ChattingFragment.tsx'
import { ChatType } from '../../enums/ChatType.ts'

const GroupChatRoute: React.FC = () => {
    const { groupId } = useParams<{ groupId: string }>()
    const setCurrentChatId = useChatDetailsStore((state) => state.setCurrentChatId)

    useEffect(() => {
        if (groupId) setCurrentChatId(groupId, ChatType.GROUP)
    }, [groupId, setCurrentChatId])

    return <ChattingFragment />
}

export default GroupChatRoute
