import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import ChatModel from '../models/user.chat.model.ts'
import UserChatsRepository from '../repositories/user.chats.repository.ts'

type chatDetailsState = {
    currentChatId: string | null
    _chatDetails: ChatModel | null
}
type chatDetailsActions = {
    setChatDetails: (chatId: string) => void
    sendTextMessage: (chatModel: ChatModel, text: string, from: string, to: string) => void
    setCurrentChatId: (chatId: string) => void
}

const useChatDetailsStore = create<chatDetailsState & chatDetailsActions>()(
    devtools(
        immer((set) => ({
            currentChatId: null,
            _chatDetails: null,
            setChatDetails: (chatId) => {
                UserChatsRepository.getLiveUserChatById(chatId, (chat) => {
                    set({ _chatDetails: chat })
                })
            },
            setCurrentChatId: (chatId) => {
                set({ currentChatId: chatId })
                useChatDetailsStore.getState().setChatDetails(chatId)
            },
            sendTextMessage: (chatModel, text, from, to) => {
                UserChatsRepository.sendTextMessage(chatModel, text, from, to, (id) => {
                    console.log('message sent', id)
                })
            },
        }))
    )
)
export default useChatDetailsStore
