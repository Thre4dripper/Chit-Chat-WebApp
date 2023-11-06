import { useEffect, useState } from 'react'
import { User, getAuth } from 'firebase/auth'
import {
    firebaseSignInWithGithub,
    firebaseSignInWithGoogle,
    firebaseSignOut,
} from '../firebase/auth/FirebaseSignIn.ts'

const useAuth = () => {
    const [user, setUser] = useState<User | null>(null)

    const googleLogin = () => {
        firebaseSignInWithGoogle((userData: User | null) => {
            setUser(userData)
        })
    }

    const githubLogin = () => {
        firebaseSignInWithGithub((userData: User | null) => {
            setUser(userData)
        })
    }

    const logout = () => {
        //logout logic
        firebaseSignOut()
        setUser(null)
    }

    useEffect(() => {
        const unsubscribe = getAuth().onAuthStateChanged((currentUser: User | null) => {
            setUser(currentUser)
            console.log(currentUser)
        })
        return () => unsubscribe()
    }, [])

    return { user, googleLogin, githubLogin, logout }
}

export default useAuth