import React, { useEffect } from 'react'
import Grid from '@mui/material/Grid2'
import ButtonsFragment from '../fragments/auth/ButtonsFragment.tsx'
import Canvas from '../fragments/auth/Canvas.tsx'
import useAuthStore from '../store/auth.store.ts'
import { GlobalConstants } from '../constants/GlobalConstants.ts'
import { useNavigate } from 'react-router-dom'
import useLocalStorage from '../hooks/useLocalStorage.ts'

const AuthScreen: React.FC = () => {
    const navigate = useNavigate()
    const { googleLogin, githubLogin } = useAuthStore()

    const [username] = useLocalStorage(GlobalConstants.USERNAME, null)

    useEffect(() => {
        if (username) {
            navigate('/')
        }
    }, [navigate, username])

    return (
        <Grid container sx={{ position: 'relative', width: '100vw', height: '100vh' }}>
            <Grid sx={{ width: '100%', height: '100%' }} className={'hidden lg:flex'}>
                <Canvas />
            </Grid>
            <Grid className={'absolute h-full right-0'}>
                <ButtonsFragment signInWithGoogle={googleLogin} signInWithGithub={githubLogin} />
            </Grid>
        </Grid>
    )
}

export default AuthScreen
