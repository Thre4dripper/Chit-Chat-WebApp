import React, { useEffect } from 'react'
import { Button } from '@mui/material'
import useAuth from '../hooks/useAuth.ts'
import { useNavigate } from 'react-router-dom'

const AuthScreen: React.FC = () => {
    const { user, loading, googleLogin, githubLogin, logout } = useAuth()
    const navigate = useNavigate()

    useEffect(() => {
        if (!loading && user) {
            navigate('/')
            console.log(user)
        }
    }, [loading, navigate, user])

    if (loading) return <div>Loading...</div>
    return (
        <div>
            <Button variant={'contained'} onClick={googleLogin}>
                Sign in with Google
            </Button>
            <Button variant={'contained'} onClick={githubLogin}>
                Sign in with Github
            </Button>
            <Button variant={'contained'} onClick={logout}>
                Sign Out
            </Button>
        </div>
    )
}

export default AuthScreen