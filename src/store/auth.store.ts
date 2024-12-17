import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { getFirestore } from 'firebase/firestore'
import UserModel from '../models/user.model.ts'
import FirebaseSignIn from '../firebase/auth/FirebaseSignIn.ts'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import FireStoreRegister from '../firebase/auth/FireStoreRegister.ts'

type AuthState = {
    user: UserModel | null
    isLoading: boolean | null
    isError: boolean | null
    isSuccess: boolean | null
}

type AuthActions = {
    googleLogin: () => Promise<void>
    githubLogin: () => Promise<void>
    onSignInResult: () => void
    logout: () => Promise<void>
}

const useAuthStore = create<AuthState & AuthActions>()(
    devtools((set) => ({
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
        onSignInResult: () => {
            const auth = getAuth()
            set({ isLoading: true })
            onAuthStateChanged(auth, async (user) => {
                if (!user) {
                    set({ isSuccess: false })
                    set({ user: null })
                    console.log('No user is signed in')
                    return
                }

                const fireStore = getFirestore()
                const isRegistered = await FireStoreRegister.registerInitialUser(fireStore, user)
                if (!isRegistered) {
                    set({ isError: true })
                    console.log('Error registering user')
                    return
                }

                set({ isSuccess: true })
                set({ isLoading: false })
                console.log('Current User:', user)
            })
        },
        logout: async () => {
            set({ isLoading: true })
            await FirebaseSignIn.firebaseSignOut()
            set({ isLoading: false })
            set({ user: null })
        },
    }))
)

export default useAuthStore
