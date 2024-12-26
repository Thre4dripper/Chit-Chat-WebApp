import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { getFirestore } from 'firebase/firestore'
import FirebaseSignIn from '../firebase/auth/FirebaseSignIn.ts'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import FireStoreRegister from '../firebase/auth/FireStoreRegister.ts'
import { immer } from 'zustand/middleware/immer'

type AuthState = {
    isLoading: boolean | null
    isAuthSuccess: boolean | null
}

type AuthActions = {
    googleLogin: () => Promise<boolean>
    githubLogin: () => Promise<boolean>
    onSignInResult: (callback: (isSuccess: boolean) => void) => void
    logout: () => Promise<boolean>
}

const useAuthStore = create<AuthState & AuthActions>()(
    devtools(
        immer((set) => ({
            isLoading: null,
            isAuthSuccess: null,
            googleLogin: async () => {
                set({ isLoading: true })
                try {
                    await FirebaseSignIn.firebaseSignInWithGoogle()
                } catch (error) {
                    console.error(error)
                    return false
                }
                set({ isLoading: false })
                return true
            },
            githubLogin: async () => {
                set({ isLoading: true })
                try {
                    await FirebaseSignIn.firebaseSignInWithGithub()
                } catch (error) {
                    console.error(error)
                    return false
                }
                set({ isLoading: false })
                return true
            },
            onSignInResult: (callback) => {
                const auth = getAuth()
                set({ isLoading: true })
                set({ isAuthSuccess: null })
                onAuthStateChanged(auth, async (user) => {
                    if (!user) {
                        set({ isLoading: false })
                        set({ isAuthSuccess: false })
                        callback(false)
                        return
                    }

                    const fireStore = getFirestore()
                    const isRegistered = await FireStoreRegister.registerInitialUser(
                        fireStore,
                        user
                    )
                    if (!isRegistered) {
                        set({ isLoading: false })
                        set({ isAuthSuccess: false })
                        console.log('Error registering user')
                        callback(false)
                        return
                    }

                    set({ isLoading: false })
                    set({ isAuthSuccess: true })
                    console.log('Current User:', user)
                    callback(true)
                })
            },
            logout: async () => {
                set({ isLoading: true })
                try {
                    await FirebaseSignIn.firebaseSignOut()
                    set({ isLoading: false })
                } catch (error) {
                    console.error(error)
                    return false
                }
                return true
            },
        }))
    )
)

export default useAuthStore
