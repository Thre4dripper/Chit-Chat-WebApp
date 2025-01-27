import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import UserModel from '../models/user.model'
import AddChatsRepository from '../repositories/add.chats.repository.ts'

type AddChatState = {
    searchedUsers: UserModel[]
}
type AddChatActions = {
    setSearchedUsers: (query: string) => void
}

const AddChatsStore = create<AddChatState & AddChatActions>()(
    devtools(
        immer((set) => ({
            searchedUsers: [],
            setSearchedUsers: (searchQuery) => {
                AddChatsRepository.searchUsers(searchQuery, set)
            },
        }))
    )
)
export default AddChatsStore
