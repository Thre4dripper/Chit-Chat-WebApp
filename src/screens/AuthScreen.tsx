import React, { useEffect } from 'react'
import useAuth from '../hooks/useAuth.ts'
import { useNavigate } from 'react-router-dom'
import LottieLoading from '../components/LottieLoading.tsx'
import useLocalStorage from '../hooks/useLocalStorage.ts'
import { GlobalConstants } from '../constants/GlobalConstants.ts'
import CssBaseline from '@mui/material/CssBaseline'
import Grid from '@mui/material/Grid'
import Paper from '@mui/material/Paper'
import Box from '@mui/material/Box'
import Avatar from '@mui/material/Avatar'
import Typography from '@mui/material/Typography'
import image from '../assets/auth/signin_image.jpg'
import logo from '../assets/logo.png'
import google_logo from '../assets/auth/google_logo.webp'
import github_logo from '../assets/auth/github_logo.png'
import { ButtonBase } from '@mui/material'

const AuthScreen: React.FC = () => {
    const { user, isLoading, googleLogin, githubLogin } = useAuth()
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
        <Grid container component='main' sx={{ height: '100vh' }}>
            <CssBaseline />
            <Grid item xs={false} sm={4} md={7}>
                <div className={'flex h-full w-full justify-center items-center'}>
                    <img src={image} alt='auth_ui_logo' className={'w-3/5'} />
                </div>
            </Grid>
            <Grid item xs={12} sm={8} md={5} component={Paper}>
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        py: 8,
                        height: '100%',
                    }}>
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: 2,
                        }}>
                        <Avatar sx={{ bgcolor: 'secondary.main' }}>
                            <img src={logo} alt='logo' className={'w-10'} />
                        </Avatar>
                        <Typography component='h1' variant='h5'>
                            Sign in
                        </Typography>
                    </Box>
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 2,
                            justifyContent: 'center',
                            alignItems: 'center',
                            height: '100%',
                        }}>
                        <Paper
                            elevation={3}
                            sx={{
                                overflow: 'hidden',
                            }}
                            onClick={googleLogin}>
                            <ButtonBase>
                                <div
                                    className={
                                        'ml-4 mr-8 my-2 flex justify-center items-center gap-4'
                                    }>
                                    <img src={google_logo} alt='github_logo' className={'w-8'} />
                                    <span className={'text-md'}>Sign in with Google</span>
                                </div>
                            </ButtonBase>
                        </Paper>
                        <Paper
                            elevation={3}
                            sx={{
                                overflow: 'hidden',
                                backgroundColor: '#24292e',
                            }}
                            onClick={githubLogin}>
                            <ButtonBase>
                                <div
                                    className={
                                        'ml-4 mr-8 my-2 flex justify-center items-center gap-4'
                                    }>
                                    <img src={github_logo} alt='github_logo' className={'w-8'} />
                                    <span className={'text-md text-white'}>
                                        Sign in with Github
                                    </span>
                                </div>
                            </ButtonBase>
                        </Paper>
                    </Box>
                </Box>
            </Grid>
        </Grid>
    )
}

export default AuthScreen
