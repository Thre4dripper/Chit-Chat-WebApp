import React, { useEffect } from 'react'
import { Button } from '@mui/material'
import useAuth from '../hooks/useAuth.ts'
import { useNavigate } from 'react-router-dom'
import LottieLoading from '../components/LottieLoading.tsx'
import useLocalStorage from '../hooks/useLocalStorage.ts'
import { GlobalConstants } from '../constants/GlobalConstants.ts'

const AuthScreen: React.FC = () => {
    const { user, isLoading, googleLogin, githubLogin, logout } = useAuth()
    const [, setUsername] = useLocalStorage(GlobalConstants.USERNAME, '')
    const navigate = useNavigate()

    useEffect(() => {
        if (isLoading) {
            // do nothing when loading
            return
        }
        if (user) {
            setUsername(user.displayName || '')
            navigate('/')
            console.log(user)
        }
    }, [isLoading, navigate, setUsername, user])

    if (isLoading) {
        return <LottieLoading />
    }
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
