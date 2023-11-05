import { useState } from 'react'
import { User, getAuth } from 'firebase/auth'
import {
    firebaseSignInWithGithub,
    firebaseSignInWithGoogle,
    firebaseSignOut,
} from '../firebase/auth/FirebaseSignIn.ts'

const useAuth = () => {
    const [user, setUser] = useState<User | null>(getAuth().currentUser)

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

    return { user, googleLogin, githubLogin, logout }
}

export default useAuth