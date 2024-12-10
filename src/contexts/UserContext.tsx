import React, { useContext, createContext, SetStateAction, useEffect, useState } from 'react'
import FirebaseSignIn from '../firebase/auth/FirebaseSignIn'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import FireStoreRegister from '../firebase/auth/FireStoreRegister.ts'
// import { useNavigate } from 'react-router-dom'

// Define types for user and context
export interface UserData {
    uid: string
    bio: string
    name: string
    profileImage: string
    status: string
    favourites: string[]
    fcmToken: string
    groups: string[]
    username: string
}

interface UserContextType {
    userData: UserData | null
    setUserData: React.Dispatch<SetStateAction<UserData | null>>
    isLoading: boolean
    isIdle: boolean
    isError: boolean
    isSuccess: boolean
    googleLogin: () => void
    githubLogin: () => void
    logout: () => Promise<void>
}

// eslint-disable-next-line react-refresh/only-export-components
export const UserContext = createContext<UserContextType>({
    userData: null,
    setUserData: () => {},
    isLoading: false,
    isError: false,
    isIdle: false,
    isSuccess: false,
    googleLogin: () => {},
    githubLogin: () => {},
    logout: async () => {},
})

export const UserDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [userData, setUserData] = useState<UserData | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [isIdle, setIsIdle] = useState(true)
    const [isError, setIsError] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)
    // const navigate = useNavigate()

    useEffect(() => {
        setIsIdle(false)
        setIsError(false)
        setIsSuccess(false)
        setIsLoading(true)

        const auth = getAuth()
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            const fireStore = getFirestore()
            if (user) {
                const ActualUser = await FireStoreRegister.registerInitialUser(fireStore, user)
                setUserData(ActualUser)
                setIsSuccess(true)
                setIsLoading(false)
                // console.log('Current User:', user) // This will be the authenticated user
            } else {
                setIsLoading(false)
                setIsError(true)
                // navigate('/auth')
                console.log('No user is signed in')
            }
        })

        return () => unsubscribe()
    }, [])

    const googleLogin = async () => {
        setIsLoading(true)
        const userData = await FirebaseSignIn.firebaseSignInWithGoogle()
        if (!userData) {
            return
        }
        const fireStore = getFirestore()
        const response = await FireStoreRegister.registerInitialUser(fireStore, userData)
        setUserData(response)
        setIsLoading(false)
    }

    const githubLogin = async () => {
        setIsLoading(true)
        const userData = await FirebaseSignIn.firebaseSignInWithGithub()
        if (!userData) {
            return
        }
        const fireStore = getFirestore()
        const response = await FireStoreRegister.registerInitialUser(fireStore, userData)
        setUserData(response)
        setIsLoading(false)
    }

    const logout = async () => {
        setIsLoading(true)
        await FirebaseSignIn.firebaseSignOut()
        setUserData(null)
        setIsLoading(false)
    }

    return (
        <UserContext.Provider
            value={{
                userData,
                setUserData,
                isLoading,
                isError,
                isSuccess,
                isIdle,
                googleLogin,
                githubLogin,
                logout,
            }}>
            {children}
        </UserContext.Provider>
    )
}

export default UserDataProvider

export const useAuthUser = () => {
    const context = useContext(UserContext)

    if (!context) {
        throw new Error('useAuthUser must be used within a UserDataProvider')
    }

    return context
}
