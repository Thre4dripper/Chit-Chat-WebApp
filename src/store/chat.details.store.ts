import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import ChatModel from '../models/user.chat.model.ts'
import UserChatsRepository from '../repositories/user.chats.repository.ts'

type chatDetailsState = {
    currentChatId: string | null
    chatDetails: ChatModel | null
}
type chatDetailsActions = {
    updateSeen: (chat: ChatModel | null) => void
    setChatDetails: (chatId: string) => void
    sendTextMessage: (chatModel: ChatModel, text: string, from: string, to: string) => void
    setCurrentChatId: (chatId: string) => void
}

const useChatDetailsStore = create<chatDetailsState & chatDetailsActions>()(
    devtools(
        immer((set) => ({
            currentChatId: null,
            chatDetails: null,
            updateSeen: (chat) => {
                UserChatsRepository.updateSeen(chat)
            },
            setChatDetails: (chatId) => {
                UserChatsRepository.getLiveUserChatById(chatId, (chat) => {
                    set((state) => {
                        // Ensure that updates only happen for the active chat
                        if (state.currentChatId === chatId) {
                            state.updateSeen(chat)
                            state.chatDetails = chat
                        }
                    })
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
