import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import ChatModel from '../models/user.chat.model.ts'
import GroupsRepository from '../repositories/group.repository.ts'

type GroupChatState = {
    isCreating: boolean
}

type GroupChatActions = {
    createGroupChat: (
        groupName: string,
        groupImage: File | null,
        selectedUsers: ChatModel[],
        onSuccess: (status: string | null) => void
    ) => void
}

const useGroupChatStore = create<GroupChatState & GroupChatActions>()(
    devtools(
        immer((set) => ({
            isCreating: false,

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
        }))
    )
)

export default useGroupChatStore
