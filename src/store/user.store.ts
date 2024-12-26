import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import UserModel from '../models/user.model.ts'
import HomeRepository from '../repositories/home.repository.ts'

type UserState = {
    user: UserModel | null
    isLoading: boolean | null
    isError: boolean | null
    isSuccess: boolean | null
}

type UserActions = {
    checkUserRegistration: (callback: (onSuccess: boolean) => void) => void
    getUserDetails: () => Promise<void>
}

// TODO - Implement initUserDetails function
const initUserDetails = () => {
    // fetch user details from firebase
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
            checkUserRegistration: (onSuccess) => {
                HomeRepository.checkInitialRegistration(onSuccess)

                HomeRepository.checkCompleteRegistration(() => {
                    //init user details everytime even if the user is not completely registered
                    //it will handle it inside the function
                    initUserDetails()
                })
            },
        }))
    )
)

export default useUserStore
