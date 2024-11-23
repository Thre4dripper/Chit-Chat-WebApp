import React from 'react'
import LottieLoading from './LottieLoading.tsx'
import { useAuthUser } from '../contexts/UseAuthUser.tsx'
import { useNavigate } from 'react-router-dom'

interface ProtectiveRouteProps {
    children: React.ReactNode
}

const ProtectiveRoute: React.FC<ProtectiveRouteProps> = ({ children }) => {
    const nav = useNavigate()
    const { isLoading, isError, isSuccess } = useAuthUser()

    if (isError) {
        nav('/auth')
    }
    if (isLoading || !isSuccess) {
        return <LottieLoading />
    }
    return <>{children}</>
}

export default ProtectiveRoute
