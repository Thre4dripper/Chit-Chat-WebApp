import { useEffect, useState } from 'react'
import { User } from 'firebase/auth'

const useAuth = () => {
    const [user, setUser] = useState<User | null>(null)

    const login = (userData: User) => {
        //login logic
        setUser(userData)
    }

    const logout = () => {
        //logout logic
        setUser(null)
    }

    useEffect(() => {
        //check if user is logged in
        setUser(null)
    }, [])

    return { user, login, logout }
}

export default useAuth