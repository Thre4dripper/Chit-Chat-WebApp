import React, { SetStateAction, createContext, useState, useContext } from 'react'
import {
    firebaseSignInWithGithub,
    firebaseSignInWithGoogle,
    firebaseSignOut,
} from '../firebase/auth/FirebaseSignIn'
import { User } from 'firebase/auth'
import { registerInitialUser } from '../firebase/auth/FireStoreRegister'

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
    setIsLoading: React.Dispatch<SetStateAction<boolean>>
    googleLogin: () => void
    githubLogin: () => void
    fetchUserData: (user: User) => Promise<void>
    logout: () => Promise<void>
}

export const UserContext = createContext<UserContextType>({
    userData: null,
    setUserData: () => {},
    isLoading: false,
    setIsLoading: () => {},
    googleLogin: () => {},
    githubLogin: () => {},
    fetchUserData: async () => {},
    logout: async () => {},
})

export const UserDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [userData, setUserData] = useState<UserData | null>(null)
    const [isLoading, setIsLoading] = useState(false)

    const fetchUserData = async (user: User) => {
        setIsLoading(true)
        try {
            const userData = await registerInitialUser(user)
            setUserData(userData)
        } catch (err) {
            console.log('Somthing went wrong in Firestore')
        }
        setIsLoading(false)
    }

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
                setIsLoading,
                googleLogin,
                githubLogin,
                logout,
                fetchUserData,
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
