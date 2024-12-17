import { PropsWithChildren, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import useAuthStore from '../store/auth.store.ts'
import LottieLoading from './LottieLoading.tsx'

const ProtectiveRoute = ({ children }: PropsWithChildren) => {
    const navigate = useNavigate()

    const { isLoading, isSuccess, onSignInResult } = useAuthStore()

    useEffect(() => {
        onSignInResult()
    }, [navigate, onSignInResult])

    if (isLoading || !isSuccess) {
        return <LottieLoading />
    }
    return <>{children}</>
}

export default ProtectiveRoute
