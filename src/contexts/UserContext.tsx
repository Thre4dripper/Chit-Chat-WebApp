import React, { useContext, createContext, SetStateAction, useEffect, useState } from 'react'
import FirebaseSignIn from '../firebase/auth/FirebaseSignIn'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import FireStoreRegister from '../firebase/auth/FireStoreRegister.ts'
import UserModel from '../models/UserModel.ts'

interface UserContextType {
    userData: UserModel | null
    setUserData: React.Dispatch<SetStateAction<UserModel | null>>
    isLoading: boolean
    isError: boolean
    isSuccess: boolean
    googleLogin: () => void
    githubLogin: () => void
    logout: () => Promise<void>
}

export const UserContext = createContext<UserContextType>({
    userData: null,
    setUserData: () => {},
    isLoading: false,
    isError: false,
    isSuccess: false,
    googleLogin: () => {},
    githubLogin: () => {},
    logout: async () => {},
})

export const UserDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [userData, setUserData] = useState<UserModel | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [isError, setIsError] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)
    // const navigate = useNavigate()

    useEffect(() => {
        setIsError(false)
        setIsSuccess(false)
        setIsLoading(true)

        const auth = getAuth()
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (!user) {
                setIsLoading(false)
                setIsSuccess(false)
                setUserData(null)
                console.log('No user is signed in')
                return
            }

            const fireStore = getFirestore()
            const isRegistered = await FireStoreRegister.registerInitialUser(fireStore, user)
            if (!isRegistered) {
                setIsError(true)
                setIsLoading(false)
                console.log('Error registering user')
                return
            }

            setIsSuccess(true)
            setIsLoading(false)
        })

        return () => unsubscribe()
    }, [])

    const googleLogin = async () => {
        setIsLoading(true)
        const userData = await FirebaseSignIn.firebaseSignInWithGoogle()
        if (!userData) {
            return
        }
        setIsLoading(false)
        setIsSuccess(true)
    }

    const githubLogin = async () => {
        setIsLoading(true)
        const userData = await FirebaseSignIn.firebaseSignInWithGithub()
        if (!userData) {
            return
        }
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
