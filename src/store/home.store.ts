import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import UserModel from '../models/user.model.ts'
import HomeRepository from '../repositories/home.repository.ts'
import useLocalStore from './local.store.ts'
import UserRepository from '../repositories/user.repository.ts'
import { getToken } from 'firebase/messaging'
import firebaseMessaging from '../firebase/FirebaseMessaging.ts'
import { getFirestore } from 'firebase/firestore'
import firebaseApp from '../firebase/FirebaseInit.ts'
import UpdateToken from '../firebase/user/UpdateToken.ts'

type HomeState = {
    user: UserModel | null
    isLoading: boolean | null
    isSuccess: boolean | null
}

type HomeActions = {
    checkUserRegistration: (callback: (onSuccess: boolean) => void) => void
    setUser: (user: UserModel | null) => void
    setUsername: (username: string) => void
    setName: (name: string) => void
    setBio: (bio: string) => void
    setProfilePicture: (profilePicture: string) => void
}

const initUserDetails = (onSuccess: () => void) => {
    const setUsername = useLocalStore.getState().setUsername

    HomeRepository.getUsername((username) => {
        // save username to local store even if it is null
        setUsername(username)
        onSuccess()

        // when username is null, then user details will be fetched from uid doc
        UserRepository.getUserDetails(() => {})

        //username is null when the user is not completely registered
        if (username === null) {
            return
        }

        // Ask for notification permission, then register the FCM token.
        // requestPermission() shows the browser prompt on first call;
        // subsequent calls are a no-op and just return the current state.
        if ('Notification' in window) {
            Notification.requestPermission().then((permission) => {
                if (permission !== 'granted') return
                getToken(firebaseMessaging, {
                    vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
                })
                    .then((currentToken) => {
                        if (currentToken) {
                            useLocalStore.getState().setFcmToken(currentToken)
                            const firestore = getFirestore(firebaseApp)
                            UpdateToken.updateFCMToken(firestore, username, currentToken)
                        }
                    })
                    .catch((err) => console.error('FCM token error:', err))
            })
        }

        // TODO write update status code
    })
}

const useHomeStore = create<HomeState & HomeActions>()(
    devtools(
        immer((set) => ({
            user: null,
            isLoading: null,
            isSuccess: null,
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
                    initUserDetails(() => {
                        // called after username is set
                        onSuccess(false)
                    })
                })
            },
            setUser: (user) => {
                set((state) => {
                    state.user = user
                })
            },
            setUsername: (username) => {
                set((state) => {
                    state.user!.username = username
                })
            },
            setName: (name) => {
                set((state) => {
                    state.user!.name = name
                })
            },
            setBio: (bio) => {
                set((state) => {
                    state.user!.bio = bio
                })
            },
            setProfilePicture: (profilePicture) => {
                set((state) => {
                    state.user!.profileImage = profilePicture
                })
            },
        }))
    )
)

export default useHomeStore
