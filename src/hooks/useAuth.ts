import { useState } from 'react'
import { User, getAuth } from 'firebase/auth'
import { firebaseSignInWithGoogle, firebaseSignOut } from '../firebase/auth/FirebaseSignIn.ts'

const useAuth = () => {
    const [user, setUser] = useState<User | null>(getAuth().currentUser)

    const login = () => {
        firebaseSignInWithGoogle((userData: User | null) => {
            setUser(userData)
        })
    }

    const logout = () => {
        //logout logic
        firebaseSignOut()
        setUser(null)
    }

    return { user, login, logout }
}

export default useAuth