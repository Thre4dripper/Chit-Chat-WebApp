import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import UserModel from '../models/user.model.ts'

type UserState = {
    user: UserModel | null
    isLoading: boolean | null
    isError: boolean | null
    isSuccess: boolean | null
}

type UserActions = {
    getUserDetails: () => Promise<void>
}

const useUserStore = create<UserState & UserActions>()(
    devtools(
        immer((set) => ({
            user: null,
            isLoading: null,
            isError: null,
            isSuccess: null,
            getUserDetails: async () => {
                set({ isLoading: true })
                try {
                    // fetch user details from firebase
                    // set user details
                } catch (error) {
                    set({ isError: true })
                    console.error(error)
                }
                set({ isLoading: false })
            },
        }))
    )
)

export default useUserStore
