import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import GroupChatModel from '../models/group.chat.model.ts'
import ChatModel from '../models/user.chat.model.ts'
import UserModel from '../models/user.model.ts'
import UserChatsRepository from '../repositories/user.chats.repository.ts'
import CommonGroups from '../firebase/groups/CommonGroups.ts'
import GetDetails from '../firebase/user/GetDetails.ts'
import { getFirestore, doc, onSnapshot } from 'firebase/firestore'
import { FirestoreCollections } from '../constants/FireStoreCollections.ts'
import ChatUtils from '../utils/ChatUtils.ts'

// Mirrors ChatProfileViewModel + ChatViewModel.listenUserStatus in Android

type ChatProfileState = {
    partnerName: string | null
    partnerBio: string | null
    partnerStatus: string
    commonGroups: GroupChatModel[]
}

type ChatProfileActions = {
    // Mirrors ChatProfileViewModel.getNameAndBio
    loadPartnerDetails: (chatModel: ChatModel, loggedInUsername: string) => void
    // Mirrors ChatProfileViewModel.commonGroups
    loadCommonGroups: (chatModel: ChatModel, loggedInUsername: string) => void
    // Mirrors ChatViewModel.listenUserStatus — returns unsubscribe fn for useEffect cleanup
    subscribePartnerStatus: (chatModel: ChatModel, loggedInUsername: string) => () => void
    // Mirrors ChatProfileViewModel.muteUnMuteChat
    muteUnMuteChat: (
        chatModel: ChatModel,
        username: string,
        mute: boolean,
        onSuccess: (success: boolean) => void
    ) => void
    reset: () => void
}

const useChatProfileStore = create<ChatProfileState & ChatProfileActions>()(
    devtools(
        immer((set) => ({
            partnerName: null,
            partnerBio: null,
            partnerStatus: 'Online',
            commonGroups: [],

            loadPartnerDetails: (chatModel, loggedInUsername) => {
                const firestore = getFirestore()
                const partnerUsername = ChatUtils.getUserChatUsername(chatModel, loggedInUsername)
                GetDetails.getUserDetails(firestore, partnerUsername, (details) => {
                    set({ partnerName: details?.name ?? null, partnerBio: details?.bio ?? null })
                })
            },

            loadCommonGroups: (chatModel, loggedInUsername) => {
                const firestore = getFirestore()
                const partnerUsername = ChatUtils.getUserChatUsername(chatModel, loggedInUsername)
                CommonGroups.getCommonGroups(
                    firestore,
                    loggedInUsername,
                    partnerUsername,
                    (groups: GroupChatModel[]) => {
                        set({ commonGroups: groups })
                    }
                )
            },

            subscribePartnerStatus: (chatModel, loggedInUsername) => {
                const partnerUsername = ChatUtils.getUserChatUsername(chatModel, loggedInUsername)
                const firestore = getFirestore()
                const userRef = doc(firestore, FirestoreCollections.USERS_COLLECTION, partnerUsername)
                const unsubscribe = onSnapshot(userRef, (userSnap) => {
                    if (userSnap.exists()) {
                        const userData = userSnap.data() as UserModel
                        set({ partnerStatus: userData.status || 'Online' })
                    }
                })
                return unsubscribe
            },

            muteUnMuteChat: (chatModel, username, mute, onSuccess) => {
                UserChatsRepository.muteUnMuteChat(chatModel, username, mute, onSuccess)
            },

            reset: () => {
                set({ partnerName: null, partnerBio: null, partnerStatus: 'Online', commonGroups: [] })
            },
        }))
    )
)

export default useChatProfileStore
