import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import ChatModel from '../models/user.chat.model'
import UserChatsRepository from '../repositories/user.chats.repository'
import UserModel from '../models/user.model'

type ChatDetailsState = {
    currentChatId: string | null
    chatDetails: ChatModel | null
}

type ChatDetailsActions = {
    updateSeen: (chat: ChatModel | null) => void
    setChatDetails: (chatId: string) => void
    sendTextMessage: (chatModel: ChatModel, text: string, from: string, to: string) => void
    sendStickerMessage: (
        chatModel: ChatModel,
        stickerIndex: number,
        from: string,
        to: string
    ) => void
    sendImageMessage: (chatModel: ChatModel, image: string, from: string, to: string) => void
    setCurrentChatId: (chatId: string) => void
    favouriteChat: (
        userModel: UserModel,
        favourite: string,
        onSuccess: (newModel: UserModel | null) => void
    ) => void
    clearChat: (chatModel: ChatModel, success: (check: boolean) => void) => void
    deleteChat: (chatModel: ChatModel, success: (check: boolean) => void) => void
}

const useChatDetailsStore = create<ChatDetailsState & ChatDetailsActions>()(
    devtools(
        immer((set) => ({
            currentChatId: null,
            chatDetails: null,
            updateSeen: (chat) => {
                if (chat) {
                    UserChatsRepository.updateSeen(chat)
                }
            },
            setChatDetails: (chatId) => {
                UserChatsRepository.getLiveUserChatById(chatId, (chat) => {
                    set((state) => {
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
            sendStickerMessage: (chatModel, stickerIndex, from, to) => {
                UserChatsRepository.sendSticker(chatModel, stickerIndex, from, to, (id) => {
                    console.log('sticker sent', id)
                })
            },
            sendImageMessage: (chatModel, image, from, to) => {
                UserChatsRepository.sendImage(chatModel, image, from, to, (id) => {
                    console.log('message sent', id)
                })
            },
            favouriteChat: (userModel, favourite, onSuccess) => {
                UserChatsRepository.favouriteChat(userModel, favourite, onSuccess)
            },
            clearChat: (chatModel, onSuccess) => {
                UserChatsRepository.clearChat(chatModel, onSuccess)
            },
            deleteChat: (chatModel, onSuccess) => {
                UserChatsRepository.deleteChat(chatModel, onSuccess)
            },
        }))
    )
)

export default useChatDetailsStore
