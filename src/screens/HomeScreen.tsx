import React, { useEffect } from 'react'
import ChatsFragment from '../fragments/home/ChatsFragment.tsx'
import UserProfileFragment from '../fragments/profile/UserProfileFragment.tsx'
import useHomeStore from '../store/home.store.ts'
import LottieLoading from '../components/LottieLoading.tsx'
import { Outlet, useNavigate } from 'react-router'
import CompleteProfileFragment from '../fragments/profile/CompleteProfileFragment.tsx'
import ImageCropFragment from '../fragments/profile/ImageCropFragment.tsx'
import AddChatDialog from '../components/dialogs/AddChatDialog.tsx'
import GroupChatDialog from '../components/dialogs/AddGroupDialog.tsx'
import useHomeChatsStore from '../store/home.chats.store.ts'
import LogoutConfirmation from '../components/dialogs/LogoutConfirmationDialog.tsx'
import UserRepository from '../repositories/user.repository.ts'
import useUserDetailsStore from '../store/user.details.store.ts'
import { enqueueSnackbar } from 'notistack'

const HomeScreen: React.FC = () => {
    const navigate = useNavigate()
    const [profileOpen, setProfileOpen] = React.useState<boolean>(false)
    const [browsedImage, setBrowseImage] = React.useState<string | null>(null)
    const [isUploadingPicture, setIsUploadingPicture] = React.useState(false)
    const [dialogState, setDialogState] = React.useState<boolean>(false)
    const [groupDialogOpen, setGroupDialogOpen] = React.useState<boolean>(false)
    const checkUserRegistration = useHomeStore((state) => state.checkUserRegistration)
    const isLoading = useHomeStore((state) => state.isLoading)
    const user = useHomeStore((state) => state.user)
    const updateProfilePicture = useUserDetailsStore((state) => state.updateProfilePicture)
    const [logoutConfirmOpen, setLogoutConfirmOpen] = React.useState<boolean>(false)

    // Derived: show profile wizard when user has no username yet
    const showCompleteProfile = Boolean(user && !user.username)

    useEffect(() => {
        checkUserRegistration((isInitial) => {
            if (isInitial) {
                setProfileOpen(true)
                console.log('User is Initially registered')
            } else {
                UserRepository.setUserOnline(() => {})
                useHomeChatsStore.getState().setHomeChats()
            }
        })
    }, [checkUserRegistration])

    // SW sends postMessage({ type: 'SW_NAVIGATE', path }) when a notification is clicked
    // and the app window is already open. React Router handles the SPA navigation.
    useEffect(() => {
        const handleSwMessage = (event: MessageEvent) => {
            if (event.data?.type === 'SW_NAVIGATE') navigate(event.data.path)
        }
        navigator.serviceWorker.addEventListener('message', handleSwMessage)
        return () => navigator.serviceWorker.removeEventListener('message', handleSwMessage)
    }, [navigate])

    // Status lifecycle: online/lastseen on focus, blur, visibility, tab close
    // Only starts after the user is fully loaded (username available)
    useEffect(() => {
        if (!user?.username) return

        // Mark online immediately once user is ready
        UserRepository.setUserOnline(() => {})

        const goOnline = () => UserRepository.setUserOnline(() => {})
        const goOffline = () => UserRepository.setUserLastSeen(() => {})

        const onVisibility = () => {
            if (document.visibilityState === 'hidden') goOffline()
            else goOnline()
        }

        window.addEventListener('focus', goOnline)
        window.addEventListener('blur', goOffline)
        document.addEventListener('visibilitychange', onVisibility)
        window.addEventListener('beforeunload', goOffline)

        return () => {
            window.removeEventListener('focus', goOnline)
            window.removeEventListener('blur', goOffline)
            document.removeEventListener('visibilitychange', onVisibility)
            window.removeEventListener('beforeunload', goOffline)
        }
    }, [user?.username])

    // Close profile panel when username is set (new user completes profile setup)
    // Uses Zustand subscription callback to satisfy linter (no direct setState in effect body)
    useEffect(() => {
        return useHomeStore.subscribe((state, prev) => {
            if (!prev.user?.username && state.user?.username) {
                setProfileOpen(false)
            }
        })
    }, [])

    // show loading until user is fetched
    if (isLoading || user === null) {
        return <LottieLoading fullScreen />
    }
    return (
        <div className={'flex flex-row bg-slate-900/90 '}>
            <div className={'w-100'}>
                {profileOpen ? (
                    <>
                        {browsedImage ? (
                            <ImageCropFragment
                                image={browsedImage}
                                cropShape={'round'}
                                aspect={1}
                                outputSize={{ width: 300, height: 300 }}
                                onCancel={() => setBrowseImage(null)}
                                onConfirmed={(file) => {
                                    setBrowseImage(null)
                                    setIsUploadingPicture(true)
                                    updateProfilePicture(file, (message) => {
                                        enqueueSnackbar(message, {
                                            variant: 'success',
                                            autoHideDuration: 3000,
                                        })
                                        setIsUploadingPicture(false)
                                    })
                                }}
                            />
                        ) : (
                            <UserProfileFragment
                                openProfile={setProfileOpen}
                                setBrowsedImage={setBrowseImage}
                                isUploadingPicture={isUploadingPicture}
                            />
                        )}
                    </>
                ) : (
                    <ChatsFragment
                        openProfile={setProfileOpen}
                        setDialogState={setDialogState}
                        setLogoutDialogState={setLogoutConfirmOpen}
                        setGroupDialogOpen={setGroupDialogOpen}
                    />
                )}
            </div>
            <div className={'flex-1 w-2/3 rounded-3xl'}>
                {showCompleteProfile ? (
                    <CompleteProfileFragment />
                ) : (
                    <Outlet context={{ dialogState, setDialogState }} />
                )}
            </div>
            <AddChatDialog dialogState={dialogState} setDialogState={setDialogState} />
            <GroupChatDialog dialogState={groupDialogOpen} setDialogState={setGroupDialogOpen} />
            <LogoutConfirmation
                open={logoutConfirmOpen}
                handleClose={() => setLogoutConfirmOpen(false)}
            />
        </div>
    )
}

export default HomeScreen
