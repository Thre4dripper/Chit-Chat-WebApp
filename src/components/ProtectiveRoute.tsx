import useAuth from '../hooks/useAuth.ts'
import { useNavigate } from 'react-router-dom'
import React, { useEffect } from 'react'
import LottieLoading from './LottieLoading.tsx'

interface ProtectiveRouteProps {
    children: React.ReactNode
}

const ProtectiveRoute: React.FC<ProtectiveRouteProps> = ({ children }) => {
    const { user, isLoading } = useAuth()
    const navigate = useNavigate()

    useEffect(() => {
        if (isLoading) {
            // do nothing when loading
            return
        }
        if (!user) {
            navigate('/auth')
        }
    }, [isLoading, navigate, user])

    if (isLoading) {
        return <LottieLoading />
    }
    return <>{children}</>
}

export default ProtectiveRoute
