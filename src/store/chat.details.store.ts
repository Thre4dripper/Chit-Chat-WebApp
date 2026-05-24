import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import ChatModel from '../models/user.chat.model'
import UserChatsRepository from '../repositories/user.chats.repository'
import UserModel from '../models/user.model.ts'
import { ChatType } from '../enums/ChatType.ts'
import useGroupChatStore from './group.chat.store.ts'

// Mirrors ChatViewModel in Android

type ChatDetailsState = {
    currentChatId: string | null
    chatDetails: ChatModel | null
    // Panel visibility — mirrors Android navigation stack (profile activities)
    isViewingProfile: boolean
    isViewingGroupProfile: boolean
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
    sendImageMessage: (
        chatModel: ChatModel,
        image: File,
        from: string,
        to: string,
        onSuccess?: (id: string | null) => void
    ) => void
    setCurrentChatId: (chatId: string, chatType: ChatType) => void
    clearCurrentChat: () => void
    // Mirrors ChatViewModel.favouriteChat
    favouriteChat: (
        userModel: UserModel,
        favourite: string,
        onSuccess: (newModel: UserModel | null) => void
    ) => void
    // Mirrors ChatViewModel.clearChat / deletedChat
    clearChat: (chatModel: ChatModel, success: (check: boolean) => void) => void
    deleteChat: (chatModel: ChatModel, success: (check: boolean) => void) => void
    // Profile panel visibility (replaces prop drilling)
    setIsViewingProfile: (value: boolean) => void
    setIsViewingGroupProfile: (value: boolean) => void
}

const useChatDetailsStore = create<ChatDetailsState & ChatDetailsActions>()(
    devtools(
        immer((set) => ({
            currentChatId: null,
            chatDetails: null,
            isViewingProfile: false,
            isViewingGroupProfile: false,

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

            setCurrentChatId: (chatId, chatType) => {
                set({
                    currentChatId: chatId,
                    isViewingProfile: false,
                    isViewingGroupProfile: false,
                })
                if (chatType === ChatType.USER) {
                    useChatDetailsStore.getState().setChatDetails(chatId)
                    useGroupChatStore.getState().clearGroupChat()
                } else {
                    useGroupChatStore.getState().setGroupChatDetails(chatId)
                    set({ chatDetails: null })
                }
            },

            clearCurrentChat: () => {
                set({
                    currentChatId: null,
                    chatDetails: null,
                    isViewingProfile: false,
                    isViewingGroupProfile: false,
                })
                useGroupChatStore.getState().clearGroupChat()
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

            sendImageMessage: (chatModel, image, from, to, onSuccess) => {
                UserChatsRepository.sendImage(chatModel, image, from, to, (id) => {
                    console.log('message sent', id)
                    onSuccess?.(id)
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

            setIsViewingProfile: (value) => {
                set({ isViewingProfile: value })
            },

            setIsViewingGroupProfile: (value) => {
                set({ isViewingGroupProfile: value })
            },
        }))
    )
)

export default useChatDetailsStore
