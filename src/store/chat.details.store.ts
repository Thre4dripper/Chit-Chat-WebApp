import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import ChatModel from '../models/user.chat.model'
import UserChatsRepository from '../repositories/user.chats.repository'
import GroupChatsRepository from '../repositories/group.chats.repository.ts'
import GroupChatModel from '../models/group.chat.model'
import UserModel from '../models/user.model.ts'
import useLocalStore from './local.store.ts'
import { ChatType } from '../enums/ChatType.ts'

type ChatDetailsState = {
    currentChatId: string | null
    chatDetails: ChatModel | null
    groupChatDetails: GroupChatModel | null
}

type ChatDetailsActions = {
    updateSeen: (chat: ChatModel | null) => void
    setChatDetails: (chatId: string) => void
    setGroupChatDetails: (chatId: string) => void
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
    sendGroupTextMessage: (groupChatModel: GroupChatModel, text: string, from: string) => void
    sendGroupStickerMessage: (
        groupChatModel: GroupChatModel,
        stickerIndex: number,
        from: string
    ) => void
    sendGroupImageMessage: (
        groupChatModel: GroupChatModel,
        image: File,
        from: string,
        onSuccess: (id: string | null) => void
    ) => void
    setCurrentChatId: (chatId: string, chatType: ChatType) => void
    exitGroup: () => void
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
            groupChatDetails: null,
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
            setGroupChatDetails: (chatId) => {
                GroupChatsRepository.getLiveGroupChatById(chatId, (group) => {
                    set((state) => {
                        if (group && state.currentChatId === chatId) {
                            GroupChatsRepository.updateGroupSeen(group)
                            state.groupChatDetails = group
                        }
                    })
                })
            },
            setCurrentChatId: (chatId, chatType) => {
                set({ currentChatId: chatId })
                if (chatType === ChatType.USER) {
                    useChatDetailsStore.getState().setChatDetails(chatId)
                    set({ groupChatDetails: null })
                } else {
                    useChatDetailsStore.getState().setGroupChatDetails(chatId)
                    set({ chatDetails: null })
                }
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
            sendGroupTextMessage: (groupChatModel, text, from) => {
                GroupChatsRepository.sendGroupTextMessage(groupChatModel, text, from, (id) => {
                    console.log('group text sent', id)
                })
            },
            sendGroupStickerMessage: (groupChatModel, stickerIndex, from) => {
                GroupChatsRepository.sendGroupSticker(groupChatModel, stickerIndex, from, (id) => {
                    console.log('group sticker sent', id)
                })
            },
            sendGroupImageMessage: (groupChatModel, image, from, onSuccess) => {
                GroupChatsRepository.sendGroupImage(groupChatModel, image, from, (id) => {
                    console.log('group image sent', id)
                    onSuccess(id)
                })
            },
            exitGroup: () => {
                const groupChatModel = useChatDetailsStore.getState().groupChatDetails
                const username = useLocalStore.getState().username
                if (!groupChatModel || !username) return
                GroupChatsRepository.exitGroup(groupChatModel, username, (success) => {
                    if (success) {
                        set({ groupChatDetails: null, currentChatId: null })
                    }
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
