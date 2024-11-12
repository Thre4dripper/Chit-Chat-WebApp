import React, { useContext, useEffect } from 'react'
import useAuth from '../hooks/useAuth.ts'
import { useNavigate } from 'react-router-dom'
import LottieLoading from '../components/LottieLoading.tsx'
import CssBaseline from '@mui/material/CssBaseline'
import Grid from '@mui/material/Grid'
import Paper from '@mui/material/Paper'
import ButtonsFragment from '../fragments/auth/ButtonsFragment.tsx'
import AnimationFragment from '../fragments/auth/AnimationFragment.tsx'
import { SnackbarContext } from '../contexts/SnackbarAlert.tsx'
const AuthScreen: React.FC = () => {
    const { user, isLoading, googleLogin, githubLogin } = useAuth()
    const navigate = useNavigate()
    const {openSnackbar}=useContext(SnackbarContext);

    useEffect(() => {
        if (isLoading) {
            // do nothing when loading
            return
        }
        if (user) {
            openSnackbar("Login Successfully","success") 
            navigate('/')
        }
    }, [isLoading, navigate, user])

    if (isLoading) {
        return <LottieLoading />
    }
    return (
        <Grid container component='main' sx={{ height: '100vh' }}>
            <CssBaseline />
            <Grid item xs={false} sm={false} md={8}>
                <AnimationFragment />
            </Grid>
            <Grid item xs={12} sm={12} md={4} component={Paper}>
                <ButtonsFragment signInWithGoogle={googleLogin} signInWithGithub={githubLogin} />
            </Grid>
        </Grid>
    )
}

export default AuthScreen
