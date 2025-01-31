import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import UserModel from '../models/user.model'
import AddChatsRepository from '../repositories/add.chats.repository.ts'
import ChatModel from '../models/user.chat.model.ts'
import UserChatsRepository from '../repositories/user.chats.repository.ts'

type AddChatState = {
    isLoading: boolean | null
    searchedUsers: UserModel[]
    UserChats: ChatModel[]
    chatById: ChatModel | null
}
type AddChatActions = {
    searchUsers: (query: string) => void
    setSearchedUsers: (users: UserModel[]) => void
    dmChat: (newChatUser: UserModel) => void
    setUserChats: () => void
    getChatById: (chatId: string) => void
}

const useAddChatsStore = create<AddChatState & AddChatActions>()(
    devtools(
        immer((set) => ({
            isLoading: null,
            searchedUsers: [],
            chatById: null,
            UserChats: [],
            searchUsers: (searchQuery) => {
                set({ isLoading: true })
                AddChatsRepository.searchUsers(searchQuery)
            },
            setSearchedUsers: (users) => {
                set({ searchedUsers: users, isLoading: false })
            },
            dmChat: (newChatUser) => {
                AddChatsRepository.addChat(newChatUser, (chatId) => {
                    if (!chatId) {
                        console.log('AddChat Repository')
                        return
                    }
                    UserChatsRepository.getUserChatById(chatId, (chat) => {
                        if (chat) {
                            set({ chatById: chat })
                        } else {
                            set({ chatById: null })
                        }
                    })
                    UserChatsRepository.getAllUserChats()
                })
            },
            setUserChats: () => {
                console.log('Called Here')
                UserChatsRepository.getAllUserChats()
            },
            getChatById: (chatId: string) => {
                UserChatsRepository.getUserChatById(chatId, (chat) => {
                    if (chat) {
                        console.log('Chat Id :', chat.chatId)
                        set({ chatById: chat })
                    } else {
                        set({ chatById: null })
                    }
                })
            },
        }))
    )
)
export default useAddChatsStore
