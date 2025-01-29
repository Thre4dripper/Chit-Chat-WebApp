import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import UserModel from '../models/user.model'
import AddChatsRepository from '../repositories/add.chats.repository.ts'

type AddChatState = {
    isLoading: boolean | null
    searchedUsers: UserModel[]
}
type AddChatActions = {
    searchUsers: (query: string) => void
    setSearchedUsers: (users: UserModel[]) => void
    dmChat:(newChatUser:UserModel)=>void
}

const useAddChatsStore = create<AddChatState & AddChatActions>()(
    devtools(
        immer((set) => ({
            isLoading: null,
            searchedUsers: [],
            searchUsers: (searchQuery) => {
                set({ isLoading: true })
                AddChatsRepository.searchUsers(searchQuery)
            },
            setSearchedUsers: (users) => {
                set({ searchedUsers: users, isLoading: false })
            },
            dmChat:(newChatUser)=>{
                AddChatsRepository.addChat(newChatUser,()=>{
                    console.log("called store Function")
                })
            }
        }))
    )
)
export default useAddChatsStore
