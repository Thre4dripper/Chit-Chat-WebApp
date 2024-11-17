import React, { useContext, useEffect } from 'react'
import useAuth from '../hooks/useAuth.ts'
import { useNavigate } from 'react-router-dom'
import LottieLoading from '../components/LottieLoading.tsx'
import CssBaseline from '@mui/material/CssBaseline'
import Grid from '@mui/material/Grid'
import Paper from '@mui/material/Paper'
import ButtonsFragment from '../fragments/auth/ButtonsFragment.tsx'
import AnimationFragment from '../fragments/auth/AnimationFragment.tsx'
import { useSnackbar } from 'notistack'
import { registerInitialUser } from '../firebase/auth/FireStoreRegister.ts'
import {UserAuth} from '../contexts/UserData.tsx';

const AuthScreen: React.FC = () => {
    const { user, isLoading, googleLogin, githubLogin } = useAuth()
    const navigate = useNavigate()
    const { enqueueSnackbar } = useSnackbar()
    const {setUserInfo}= useContext(UserAuth);

    const RegisterUser=async ()=>{
        if (isLoading) {
            // do nothing when loading
            return
        }
        if (user) {
            
            try{
           
            const response=await registerInitialUser(user);
            

            if(response){
                setUserInfo(response);

                enqueueSnackbar('Successfully Logged In', {
                    variant: 'success',
                    autoHideDuration: 3000,
                    anchorOrigin: {
                        vertical: 'bottom',
                        horizontal: 'right',
                    },
                    preventDuplicate: true,
                })
            navigate('/')
             } 
            }catch(err){
                enqueueSnackbar('Something Went Wrong', {
                    variant: 'error',
                    autoHideDuration: 3000,
                    anchorOrigin: {
                        vertical: 'bottom',
                        horizontal: 'right',
                    },
                    preventDuplicate: true,
                })
             
            }
            
        }
    }
    useEffect(() => {
       RegisterUser();
    }, [isLoading, navigate, user])

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
