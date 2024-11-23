import React, { createContext, SetStateAction, useEffect, useState } from 'react'
import {
    firebaseSignInWithGithub,
    firebaseSignInWithGoogle,
    firebaseSignOut,
} from '../firebase/auth/FirebaseSignIn'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { registerInitialUser } from '../firebase/auth/FireStoreRegister'
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
            if (user) {
               const ActualUser= await registerInitialUser(user)
                setUserData(ActualUser)
                setIsSuccess(true)
                setIsLoading(false)
                console.log('Current User:', user) // This will be the authenticated user
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
        const userData = await firebaseSignInWithGoogle()
        if (!userData) {
            return
        }
        const response = await registerInitialUser(userData)
        setUserData(response)
        setIsLoading(false)
    }

    const githubLogin = async () => {
        setIsLoading(true)
        const userData = await firebaseSignInWithGithub()
        if (!userData) {
            return
        }
        const response = await registerInitialUser(userData)
        setUserData(response)
        setIsLoading(false)
    }

    const logout = async () => {
        setIsLoading(true)
        await firebaseSignOut()
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
