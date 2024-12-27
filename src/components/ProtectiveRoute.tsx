import { PropsWithChildren, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import useAuthStore from '../store/auth.store.ts'
import LottieLoading from './LottieLoading.tsx'
import useLocalStore from '../store/local.store.ts'
import { enqueueSnackbar } from 'notistack'

const ProtectiveRoute = ({ children }: PropsWithChildren) => {
    const navigate = useNavigate()

    const { isLoading, isAuthSuccess, onSignInResult } = useAuthStore()
    const setUsername = useLocalStore((state) => state.setUsername)

    useEffect(() => {
        onSignInResult((isSuccess) => {
            if (!isSuccess) {
                navigate('/auth')
                setUsername(null)
            } else {
                enqueueSnackbar('Welcome', {
                    variant: 'success',
                    anchorOrigin: { vertical: 'bottom', horizontal: 'right' },
                })
                //TODO remove this from here, the username set should be done in the home page after complete registration
                setUsername('username')
            }
        })
    }, [navigate, onSignInResult, setUsername])

    if (isLoading || !isAuthSuccess) {
        return <LottieLoading fullScreen />
    }
    return <>{children}</>
}

export default ProtectiveRoute
