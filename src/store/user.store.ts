import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import UserModel from '../models/user.model.ts'
import HomeRepository from '../repositories/home.repository.ts'
import useLocalStore from './local.store.ts'
import UserRepository from '../repositories/user.repository.ts'

type UserState = {
    user: UserModel | null
    isLoading: boolean | null
    isSuccess: boolean | null
}

type UserActions = {
    checkUserRegistration: (callback: (onSuccess: boolean) => void) => void
    getUserDetails: () => Promise<void>
}

const initUserDetails = () => {
    // TODO fetch fcm token here like android
    const setUsername = useLocalStore.getState().setUsername

    HomeRepository.getUsername((username) => {
        // save username to local store even if it is null
        setUsername(username)

        // when username is null, then user details will be fetched from uid doc
        UserRepository.getUserDetails(() => {})

        //username is null when the user is not completely registered
        if (username === null) {
            return
        }

        // TODO write update status and token code
    })
}

const useUserStore = create<UserState & UserActions>()(
    devtools(
        immer((set) => ({
            user: null,
            isLoading: null,
            isSuccess: null,
            getUserDetails: async () => {
                set({ isLoading: true })
                try {
                    // fetch user details from firebase
                    // set user details
                } catch (error) {
                    console.error(error)
                }
                set({ isLoading: false })
            },
            checkUserRegistration: (onSuccess) => {
                set({ isLoading: true })
                set({ isSuccess: null })
                HomeRepository.checkInitialRegistration((isInitial) => {
                    set({ isLoading: false })
                    set({ isSuccess: true })
                    onSuccess(isInitial)
                })

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
