import useAuth from '../hooks/useAuth.ts'
import { useNavigate } from 'react-router-dom'
import React, { useContext, useEffect } from 'react'
import LottieLoading from './LottieLoading.tsx'
import useLocalStorage from '../hooks/useLocalStorage.ts'
import { GlobalConstants } from '../constants/GlobalConstants.ts'
import { UserAuth } from '../contexts/UserData.tsx'
import { registerInitialUser } from '../firebase/auth/FireStoreRegister.ts'

interface ProtectiveRouteProps {
    children: React.ReactNode
}

const ProtectiveRoute: React.FC<ProtectiveRouteProps> = ({ children }) => {
    const { user, isLoading } = useAuth()
    const [, setUsername] = useLocalStorage(GlobalConstants.USERNAME, '')

    const navigate = useNavigate()
    const { userInfo, setUserInfo } = useContext(UserAuth)

    const CallingUserInfo = async () => {
        if (user) setUserInfo(await registerInitialUser(user))
    }

    useEffect(() => {
        if (isLoading) {
            // do nothing   when loading
            return
        }
        if (user) {
            setUsername(user.displayName || '')
        }
        if (!userInfo) {
            CallingUserInfo()
        }
        if (!user) {
            navigate('/auth')
        }
    }, [isLoading, navigate, setUsername, user])

    if (isLoading) {
        return <LottieLoading />
    }
    return <>{children}</>
}

export default ProtectiveRoute
