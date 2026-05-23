import React, { useEffect } from 'react'
import { useOutletContext } from 'react-router'
import useChatDetailsStore from '../../store/chat.details.store.ts'
import useHomeChatsStore from '../../store/home.chats.store.ts'
import EmptyChatFragment from '../../fragments/home/EmptyChatFragment.tsx'
import AddChatsFragment from '../../fragments/profile/AddChatsFragment.tsx'

export type HomeOutletContext = {
    dialogState: boolean
    setDialogState: React.Dispatch<React.SetStateAction<boolean>>
}

const HomeIndexRoute: React.FC = () => {
    const clearCurrentChat = useChatDetailsStore((state) => state.clearCurrentChat)
    const chats = useHomeChatsStore((state) => state.homeChats)
    const { dialogState, setDialogState } = useOutletContext<HomeOutletContext>()

    useEffect(() => {
        clearCurrentChat()
    }, [clearCurrentChat])

    if (chats.length === 0) {
        return <AddChatsFragment dialogState={dialogState} setDialogState={setDialogState} />
    }

    return <EmptyChatFragment />
}

export default HomeIndexRoute
