import useAuth from '../hooks/useAuth.ts'
import { useNavigate } from 'react-router-dom'
import React, { useEffect } from 'react'

interface ProtectiveRouteProps {
    component: React.FC
}

const ProtectiveRoute: React.FC<ProtectiveRouteProps> = ({ component: Component }) => {
    const { user } = useAuth()
    const navigate = useNavigate()

    useEffect(() => {
        if (!user) {
            navigate('/auth')
        }
    }, [navigate, user])

    return <Component />
}

export default ProtectiveRoute