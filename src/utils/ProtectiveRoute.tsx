import useAuth from '../hooks/useAuth.ts'
import { useNavigate } from 'react-router-dom'
import React, { useEffect } from 'react'

interface ProtectiveRouteProps {
    component: React.FC
}

const ProtectiveRoute: React.FC<ProtectiveRouteProps> = ({ component: Component }) => {
    const { user, loading } = useAuth()
    const navigate = useNavigate()

    useEffect(() => {
        if (loading) {
            // do nothing when loading
            return
        }
        if (!user) {
            navigate('/auth')
        }
    }, [loading, navigate, user])

    if (loading) return <div>Loading...</div>
    return <Component />
}

export default ProtectiveRoute