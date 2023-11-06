import { useEffect, useState } from 'react'
import { User, getAuth } from 'firebase/auth'
import {
    firebaseSignInWithGithub,
    firebaseSignInWithGoogle,
    firebaseSignOut,
} from '../firebase/auth/FirebaseSignIn.ts'

const useAuth = () => {
    const [user, setUser] = useState<User | null>(null)

    const googleLogin = async () => {
        const userData = await firebaseSignInWithGoogle()
        setUser(userData)
    }

    const githubLogin = async () => {
        const userData = await firebaseSignInWithGithub()
        setUser(userData)
    }

    const logout = async () => {
        //logout logic
        await firebaseSignOut()
        setUser(null)
    }

    useEffect(() => {
        const unsubscribe = getAuth().onAuthStateChanged((currentUser: User | null) => {
            setUser(currentUser)
        })
        return () => unsubscribe()
    }, [])

    return { user, googleLogin, githubLogin, logout }
}

export default useAuth