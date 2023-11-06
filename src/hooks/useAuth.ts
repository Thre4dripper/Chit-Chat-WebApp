import { useEffect, useState } from 'react'
import { User, getAuth } from 'firebase/auth'
import {
    firebaseSignInWithGithub,
    firebaseSignInWithGoogle,
    firebaseSignOut,
} from '../firebase/auth/FirebaseSignIn.ts'

const useAuth = () => {
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)

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
            setLoading(false)
        })
        return () => unsubscribe()
    }, [])

    return { user, loading, googleLogin, githubLogin, logout }
}

export default useAuth