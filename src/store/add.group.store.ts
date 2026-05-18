import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'

import useHomeChatStore from './home.chats.store.ts'
import useHomeStore from './home.store.ts'
import ChatUtils from '../utils/ChatUtils.ts'
import ChatModel from '../models/user.chat.model.ts'

type GroupChatUsersState = {
    isLoading: boolean | null
    searchedUsers: ChatModel[]
}

type GroupChatUsersActions = {
    searchUsers: (query: string) => void
    setSearchedUsers: (users: ChatModel[]) => void
}

const useGroupChatUsersStore = create<GroupChatUsersState & GroupChatUsersActions>()(
    devtools(
        immer((set) => ({
            isLoading: null,
            searchedUsers: [],

            searchUsers: (searchQuery: string) => {
                set({ isLoading: true })

                const homeChats = useHomeChatStore.getState().homeChats
                const loggedInUsername = useHomeStore.getState().user?.username || ''

                const matchedChats = homeChats
                    .filter((chat) => chat.type === 'USER' && chat.userChat !== null)
                    .map((chat) => chat.userChat!)
                    .filter((chatModel) =>
                        ChatUtils.getUserChatUsername(chatModel, loggedInUsername)
                            .toLowerCase()
                            .includes(searchQuery.toLowerCase())
                    )

                set({ searchedUsers: matchedChats, isLoading: false })
            },

            setSearchedUsers: (users) => {
                set({ searchedUsers: users, isLoading: false })
            },
        }))
    )
)

export default useGroupChatUsersStore
