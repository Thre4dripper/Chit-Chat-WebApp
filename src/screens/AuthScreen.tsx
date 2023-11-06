import React, { useEffect } from 'react'
import { Button } from '@mui/material'
import useAuth from '../hooks/useAuth.ts'
import { useNavigate } from 'react-router-dom'

const AuthScreen: React.FC = () => {
    const { user, googleLogin, githubLogin, logout } = useAuth()
    const navigate = useNavigate()

    useEffect(() => {
        if (user) {
            // navigate('/')
            console.log(user)
        }
    }, [navigate, user])

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