import React from 'react'
import { Button } from '@mui/material'
import useAuth from '../hooks/useAuth.ts'

const AuthScreen: React.FC = () => {
    const { login, logout } = useAuth()

    return (
        <div>
            <Button variant={'contained'} onClick={login}>
                Sign in with Google
            </Button>
            <Button variant={'contained'} onClick={logout}>
                Sign in with Github
            </Button>
        </div>
    )
}

export default AuthScreen