import React, { useEffect } from 'react'
import ChatsFragment from '../fragments/home/ChatsFragment.tsx'
import UserProfileFragment from '../fragments/profile/UserProfileFragment.tsx'
import useHomeStore from '../store/home.store.ts'
import LottieLoading from '../components/LottieLoading.tsx'
import { useNavigate } from 'react-router-dom'
import CompleteProfileFragment from '../fragments/profile/CompleteProfileFragment.tsx'
import ImageCropFragment from '../fragments/profile/ImageCropFragment.tsx'
import AddChatsFragment from '../fragments/profile/AddChatsFragment.tsx'
import ChattingFragment from '../fragments/home/ChattingFragment.tsx'
import AddChatDialog from '../components/dialogs/AddChatDialog.tsx'
import useHomeChatsStore from '../store/home.chats.store.ts'

const HomeScreen: React.FC = () => {
    const navigate = useNavigate()
    const [profileOpen, setProfileOpen] = React.useState<boolean>(false)
    const [showCompleteProfile, setShowCompleteProfile] = React.useState<boolean>(false)
    const [browsedImage, setBrowseImage] = React.useState<string | null>(null)
    const [dialogState, setDialogState] = React.useState<boolean>(false)
    const checkUserRegistration = useHomeStore((state) => state.checkUserRegistration)
    const isLoading = useHomeStore((state) => state.isLoading)
    const user = useHomeStore((state) => state.user)
    const chats = useHomeChatsStore((state) => state.homeChats)

    useEffect(() => {
        checkUserRegistration((isInitial) => {
            if (isInitial) {
                setProfileOpen(true)
                setShowCompleteProfile(true)
                console.log('User is registered')
            } else {
                useHomeChatsStore.getState().setHomeChats()
            }
        })
    }, [checkUserRegistration, navigate])

    useEffect(() => {
        setShowCompleteProfile(!user?.username)
        setProfileOpen(!user?.username)
    }, [user?.username])

    // show loading until user is fetched
    if (isLoading || user === null) {
        return <LottieLoading fullScreen />
    }

    return (
        <div className={'flex flex-row bg-slate-900/90 '}>
            <div className={'w-[25rem]'}>
                {profileOpen ? (
                    <>
                        {browsedImage ? (
                            <ImageCropFragment
                                image={browsedImage}
                                cropShape={'round'}
                                aspect={1}
                                outputSize={{ width: 300, height: 300 }}
                                onCancel={() => setBrowseImage(null)}
                                onConfirmed={() => {
                                    setBrowseImage(null)
                                }}
                            />
                        ) : (
                            <UserProfileFragment
                                openProfile={setProfileOpen}
                                setBrowsedImage={setBrowseImage}
                            />
                        )}
                    </>
                ) : (
                    <ChatsFragment openProfile={setProfileOpen} setDialogState={setDialogState} />
                )}
            </div>
            <div className={'flex-1 w-2/3 rounded-3xl'}>
                {showCompleteProfile ? (
                    <CompleteProfileFragment />
                ) : chats.length === 0 ? (
                    <AddChatsFragment dialogState={dialogState} setDialogState={setDialogState} />
                ) : (
                    <ChattingFragment />
                )}
            </div>
            <AddChatDialog dialogState={dialogState} setDialogState={setDialogState} />
        </div>
    )
}

export default HomeScreen
