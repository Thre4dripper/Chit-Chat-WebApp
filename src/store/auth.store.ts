import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { getFirestore } from 'firebase/firestore'
import FirebaseSignIn from '../firebase/auth/FirebaseSignIn.ts'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import FireStoreRegister from '../firebase/auth/FireStoreRegister.ts'
import { immer } from 'zustand/middleware/immer'
import UserModel from '../models/user.model.ts'

type AuthState = {
    user: UserModel | null
    isLoading: boolean | null
    isError: boolean | null
    isSuccess: boolean | null
}

type AuthActions = {
    googleLogin: () => Promise<void>
    githubLogin: () => Promise<void>
    onSignInResult: (callback: (isSuccess: boolean) => void) => void
    logout: () => Promise<void>
}

const useAuthStore = create<AuthState & AuthActions>()(
    devtools(
        immer((set) => ({
            user: null,
            isLoading: null,
            isError: null,
            isSuccess: null,
            googleLogin: async () => {
                set({ isLoading: true })
                await FirebaseSignIn.firebaseSignInWithGoogle()
                set({ isLoading: false })
            },
            githubLogin: async () => {
                set({ isLoading: true })
                await FirebaseSignIn.firebaseSignInWithGithub()
                set({ isLoading: false })
            },
            onSignInResult: (callback) => {
                const auth = getAuth()
                set({ isLoading: true })
                onAuthStateChanged(auth, async (user) => {
                    console.log('Auth:', auth.currentUser)
                    if (!user) {
                        set({ isSuccess: false })
                        callback(false)
                        return
                    }

                    const fireStore = getFirestore()
                    const isRegistered = await FireStoreRegister.registerInitialUser(
                        fireStore,
                        user
                    )
                    if (!isRegistered) {
                        set({ isError: true })
                        console.log('Error registering user')
                        callback(false)
                        return
                    }

                    set({ isSuccess: true })
                    set({ isLoading: false })
                    console.log('Current User:', user)
                    callback(true)
                })
            },
            logout: async () => {
                set({ isLoading: true })
                await FirebaseSignIn.firebaseSignOut()
                set({ isLoading: false })
            },
        }))
    )
)

export default useAuthStore
