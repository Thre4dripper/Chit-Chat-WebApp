import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import UserModel from '../models/user.model'
import AddChatsRepository from '../repositories/add.chats.repository.ts'

type AddChatState = {
    isLoading:boolean
    searchedUsers: UserModel[]
}
type AddChatActions = {
    searchUsers: (query: string) => void
}

const useAddChatsStore = create<AddChatState & AddChatActions>()(
    devtools(
        immer((set) => (
                {
                    searchedUsers: [],
                    isLoading:false,
                    searchUsers: (searchQuery) => {

                            AddChatsRepository.searchUsers(searchQuery);
                            set({isLoading:false})

                    },
                }
            ),
        ),
    ),
)
export default useAddChatsStore
