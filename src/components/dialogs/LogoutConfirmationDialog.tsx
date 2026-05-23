import React from 'react'
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Button,
    Divider,
    Avatar,
} from '@mui/material'
import useAuthStore from '../../store/auth.store.ts'
import useLocalStore from '../../store/local.store.ts'
import useHomeChatsStore from '../../store/home.chats.store.ts'
import logo from '../../assets/logo.png'
import UserRepository from '../../repositories/user.repository.ts'
import { getFirestore } from 'firebase/firestore'
import UpdateToken from '../../firebase/user/UpdateToken.ts'

interface LogoutConfirmationProps {
    open: boolean
    handleClose: () => void
}

const LogoutConfirmation: React.FC<LogoutConfirmationProps> = ({ open, handleClose }) => {
    const { logout } = useAuthStore()
    const setUsername = useLocalStore((state) => state.setUsername)
    const logoutUser = async () => {
        // Set user status to "LastSeen" before logging out
        UserRepository.setUserLastSeen(() => {
            performLogout()
        })
    }

    const performLogout = async () => {
        // Clear FCM token before signing out (mirrors Android UserRepository.updateToken)
        const username = useLocalStore.getState().username
        if (username) {
            const firestore = getFirestore()
            UpdateToken.updateFCMToken(firestore, username, '')
        }
        useLocalStore.getState().setFcmToken(null)

        await logout()
        setUsername(null)
        useHomeChatsStore.setState({ homeChats: [] })
        handleClose()
    }
    return (
        <Dialog open={open} onClose={handleClose} fullWidth={true}>
            <DialogTitle>
                <div className={'flex flex-row items-center justify-start gap-4'}>
                    <Avatar src={logo} />
                    Logout
                </div>
            </DialogTitle>
            <Divider />
            <DialogContent>
                <DialogContentText>Are you sure you want to logout?</DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color='primary'>
                    No
                </Button>
                <Button onClick={logoutUser} color='error'>
                    Yes
                </Button>
            </DialogActions>
        </Dialog>
    )
}
export default LogoutConfirmation
