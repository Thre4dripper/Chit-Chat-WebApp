import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import LottieLoading from '../components/LottieLoading.tsx'
import Grid from '@mui/material/Grid2'
import ButtonsFragment from '../fragments/auth/ButtonsFragment.tsx'
import { useSnackbar } from 'notistack'

import { useAuthUser } from '../contexts/UserContext.tsx'
import Canvas from '../fragments/auth/Canvas.tsx'

const AuthScreen: React.FC = () => {
    const navigate = useNavigate()
    const { enqueueSnackbar } = useSnackbar()
    const { userData, googleLogin, githubLogin, isLoading } = useAuthUser()

    useEffect(() => {
        if (isLoading) {
            return
        }
        if (userData) {
            navigate('/')
            enqueueSnackbar('Login Successfully', {
                variant: 'success',
                autoHideDuration: 3000,
                anchorOrigin: {
                    vertical: 'bottom',
                    horizontal: 'right',
                },
                preventDuplicate: true,
            })
        }
    }, [isLoading, userData, enqueueSnackbar, navigate])

    if (isLoading) {
        return <LottieLoading />
    }
    return (
        <Grid container sx={{ position: 'relative', width: '100vw', height: '100vh' }}>
            <Grid
                sx={{ position: 'absolute', width: '100%', height: '100%' }}
                className={'hidden lg:flex'}>
                <Canvas />
            </Grid>
            <Grid
                sx={{
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                }}
                className={'flex justify-center lg:justify-end'}>
                <ButtonsFragment signInWithGoogle={googleLogin} signInWithGithub={githubLogin} />
            </Grid>
        </Grid>
    )
}

export default AuthScreen
