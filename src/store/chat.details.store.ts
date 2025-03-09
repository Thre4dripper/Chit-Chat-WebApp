import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import ChatModel from '../models/user.chat.model.ts'
import UserChatsRepository from '../repositories/user.chats.repository.ts'

type chatDetailsState = {
    _chatDetails: ChatModel | null
}
type chatDetailsActions = {
    setChatDetails: (chatId: string) => void
}

const useChatDetailsStore = create<chatDetailsState & chatDetailsActions>()(
    devtools(
        immer((set) => ({
            _chatDetails: null,
            setChatDetails: (chatId) => {
                UserChatsRepository.getLiveUserChatById(chatId, (chat) => {
                    set({ _chatDetails: chat })
                })
            },
        }))
    )
)
export default useChatDetailsStore
