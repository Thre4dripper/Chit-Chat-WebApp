import React, { useEffect } from 'react'
import ChatsFragment from '../fragments/home/ChatsFragment.tsx'
import ChattingFragment from '../fragments/home/ChattingFragment.tsx'
import UserProfileFragment from '../fragments/profile/UserProfileFragment.tsx'
import useHomeStore from '../store/home.store.ts'
import LottieLoading from '../components/LottieLoading.tsx'
import { useNavigate } from 'react-router-dom'
import CompleteProfileFragment from '../fragments/profile/CompleteProfileFragment.tsx'

const HomeScreen: React.FC = () => {
    const navigate = useNavigate()
    const [profileOpen, setProfileOpen] = React.useState<boolean>(false)
    const [showCompleteProfile, setShowCompleteProfile] = React.useState<boolean>(false)

    const checkUserRegistration = useHomeStore((state) => state.checkUserRegistration)
    const isLoading = useHomeStore((state) => state.isLoading)

    useEffect(() => {
        checkUserRegistration((isInitial) => {
            if (isInitial) {
                setProfileOpen(true)
                setShowCompleteProfile(true)
                console.log('User is registered')
            } else {
                navigate('/auth')
            }
        })
    }, [checkUserRegistration, navigate])

    if (isLoading) {
        return <LottieLoading fullScreen />
    }

    return (
        <div className={'flex flex-row bg-slate-900/90 '}>
            <div className={'w-[25rem]'}>
                {profileOpen ? (
                    <UserProfileFragment openProfile={setProfileOpen} />
                ) : (
                    <ChatsFragment openProfile={setProfileOpen} />
                )}
            </div>
            <div className={'flex-1 w-2/3 rounded-3xl'}>
                {showCompleteProfile ? <CompleteProfileFragment /> : <ChattingFragment />}
            </div>
        </div>
    )
}

export default HomeScreen
