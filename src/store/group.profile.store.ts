import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import GroupChatModel from '../models/group.chat.model.ts'
import GroupChatsRepository from '../repositories/group.chats.repository.ts'
import GetDetails from '../firebase/user/GetDetails.ts'
import AddChatsRepository from '../repositories/add.chats.repository.ts'
import FindMemberChat from '../firebase/groups/FindMemberChat.ts'
import UpdateGroup from '../firebase/groups/UpdateGroup.ts'
import { getFirestore } from 'firebase/firestore'
import useHomeChatsStore from './home.chats.store.ts'
import useLocalStore from './local.store.ts'

// Mirrors GroupProfileViewModel in Android

type GroupProfileActions = {
    // Mirrors GroupProfileViewModel.muteUnMuteGroup
    muteUnMuteGroup: (
        groupChatModel: GroupChatModel,
        username: string,
        mute: boolean,
        onSuccess: (success: boolean) => void
    ) => void
    // Mirrors GroupProfileViewModel.findGroupMember
    // 1. Check homeChats (fast in-memory) 2. Query Firestore via FindMemberChat 3. Create DM if none
    findGroupMember: (memberUsername: string, onSuccess: (chatId: string | null) => void) => void
    // Mirrors GroupsRepository.updateGroupImage (GroupProfileViewModel.updateGroupImage)
    updateGroupImage: (groupId: string, image: File, onSuccess: (success: boolean) => void) => void
}

const useGroupProfileStore = create<GroupProfileActions>()(
    devtools(
        immer(() => ({
            muteUnMuteGroup: (groupChatModel, username, mute, onSuccess) => {
                GroupChatsRepository.muteUnMuteGroupChat(groupChatModel, username, mute, onSuccess)
            },

            findGroupMember: (memberUsername, onSuccess) => {
                // Step 1: Check in-memory homeChats for fast lookup
                const homeChats = useHomeChatsStore.getState().homeChats
                const existingChat = homeChats.find((item) => {
                    const uc = item.userChat
                    return (
                        uc?.dmChatUser1?.username === memberUsername ||
                        uc?.dmChatUser2?.username === memberUsername
                    )
                })
                if (existingChat?.userChat?.chatId) {
                    onSuccess(existingChat.userChat.chatId)
                    return
                }

                // Step 2: Direct Firestore query via FindMemberChat
                const loggedInUsername = useLocalStore.getState().username
                if (!loggedInUsername) {
                    onSuccess(null)
                    return
                }

                FindMemberChat.findChatId(loggedInUsername, memberUsername, (chatId) => {
                    if (chatId) {
                        onSuccess(chatId)
                        return
                    }

                    // Step 3: No DM exists yet → fetch user details and create one
                    const firestore = getFirestore()
                    GetDetails.getUserDetails(firestore, memberUsername, (memberUser) => {
                        if (!memberUser) {
                            onSuccess(null)
                            return
                        }
                        AddChatsRepository.addChat(memberUser, (newChatId) => {
                            onSuccess(newChatId)
                        })
                    })
                })
            },

            updateGroupImage: (groupId, image, onSuccess) => {
                UpdateGroup.updateGroupImage(groupId, image, onSuccess)
            },
        }))
    )
)

export default useGroupProfileStore
