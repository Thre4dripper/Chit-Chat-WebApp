import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import ChatModel from '../models/user.chat.model.ts'
import GroupChatModel from '../models/group.chat.model.ts'
import GroupsRepository from '../repositories/group.repository.ts'
import GroupChatsRepository from '../repositories/group.chats.repository.ts'
import useLocalStore from './local.store.ts'

// Mirrors GroupChatViewModel in Android

type GroupChatState = {
    isCreating: boolean
    // Active group chat state (mirrors GroupChatViewModel._groupChatDetails)
    groupChatDetails: GroupChatModel | null
    _currentGroupId: string | null
}

type GroupChatActions = {
    // Group creation (mirrors GroupChatViewModel.createGroup)
    createGroupChat: (
        groupName: string,
        groupImage: File | null,
        selectedUsers: ChatModel[],
        onSuccess: (status: string | null) => void
    ) => void
    // Group messaging (mirrors GroupChatViewModel live/send/exit methods)
    setGroupChatDetails: (chatId: string) => void
    clearGroupChat: () => void
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
    exitGroup: () => void
}

const useGroupChatStore = create<GroupChatState & GroupChatActions>()(
    devtools(
        immer((set) => ({
            isCreating: false,
            groupChatDetails: null,
            _currentGroupId: null,

            createGroupChat: async (groupName, groupImage, selectedUsers, onSuccess) => {
                try {
                    set({ isCreating: true })
                    GroupsRepository.createGroup(
                        groupName,
                        groupImage,
                        selectedUsers,
                        (status: string | null) => {
                            set({ isCreating: false })
                            onSuccess(status)
                        }
                    )
                } catch (err) {
                    console.error('Error creating group:', err)
                    set({ isCreating: false })
                    onSuccess(null)
                }
            },

            setGroupChatDetails: (chatId) => {
                set({ _currentGroupId: chatId })
                GroupChatsRepository.getLiveGroupChatById(chatId, (group) => {
                    // Guard against stale updates when user has already navigated away
                    if (useGroupChatStore.getState()._currentGroupId !== chatId) return
                    if (group) {
                        GroupChatsRepository.updateGroupSeen(group)
                    }
                    set({ groupChatDetails: group })
                })
            },

            clearGroupChat: () => {
                set({ groupChatDetails: null, _currentGroupId: null })
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
                const groupChatModel = useGroupChatStore.getState().groupChatDetails
                const username = useLocalStore.getState().username
                if (!groupChatModel || !username) return
                GroupChatsRepository.exitGroup(groupChatModel, username, (success) => {
                    if (success) {
                        set({ groupChatDetails: null, _currentGroupId: null })
                    }
                })
            },
        }))
    )
)

export default useGroupChatStore
