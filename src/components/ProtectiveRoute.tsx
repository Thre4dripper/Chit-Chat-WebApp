import { PropsWithChildren, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import useAuthStore from '../store/auth.store.ts'
import LottieLoading from './LottieLoading.tsx'
import useLocalStore from '../store/local.store.ts'

const ProtectiveRoute = ({ children }: PropsWithChildren) => {
    const navigate = useNavigate()

    const { isLoading, isSuccess, onSignInResult } = useAuthStore()
    const setUsername = useLocalStore((state) => state.setUsername)

    useEffect(() => {
        onSignInResult((isSuccess) => {
            if (!isSuccess) {
                navigate('/auth')
            }

            //TODO remove this from here, the username set should be done in the home page after complete registration
            setUsername('username')
        })
    }, [navigate, onSignInResult, setUsername])

    if (isLoading || !isSuccess) {
        return <LottieLoading />
    }
    return <>{children}</>
}

export default ProtectiveRoute
