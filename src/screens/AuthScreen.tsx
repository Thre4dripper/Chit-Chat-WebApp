import React from 'react'
import { Button } from '@mui/material'
import useAuth from '../hooks/useAuth.ts'

const AuthScreen: React.FC = () => {
    const { googleLogin, githubLogin, logout } = useAuth()

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