import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import LottieLoading from '../components/LottieLoading.tsx'
import CssBaseline from '@mui/material/CssBaseline'
import Grid from '@mui/material/Grid'
import Paper from '@mui/material/Paper'
import ButtonsFragment from '../fragments/auth/ButtonsFragment.tsx'
import AnimationFragment from '../fragments/auth/AnimationFragment.tsx'
import { useSnackbar } from 'notistack'

import { useAuthUser } from '../contexts/UserContext.tsx'

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
        <Grid container component='main' sx={{ height: '100vh' }}>
            <CssBaseline />
            <Grid item xs={false} sm={false} md={9}>
                <AnimationFragment />
            </Grid>
            <Grid item xs={12} sm={12} md={3} component={Paper}>
                <ButtonsFragment signInWithGoogle={googleLogin} signInWithGithub={githubLogin} />
            </Grid>
        </Grid>
    )
}

export default AuthScreen
