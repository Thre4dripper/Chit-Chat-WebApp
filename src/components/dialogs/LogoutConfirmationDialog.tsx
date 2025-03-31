import React from 'react'
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Button,
    Divider,
    Box,
} from '@mui/material'
import useAuthStore from '../../store/auth.store.ts'
import useLocalStore from '../../store/local.store.ts'
import useHomeChatsStore from '../../store/home.chats.store.ts'

interface LogoutConfirmationProps {
    open: boolean
    handleClose: () => void
}

const LogoutConfirmation: React.FC<LogoutConfirmationProps> = ({ open, handleClose }) => {
    const { logout } = useAuthStore()
    const setUsername = useLocalStore((state) => state.setUsername)
    const logoutUser = async () => {
        await logout()
        setUsername(null)
        useHomeChatsStore.setState({ homeChats: [] })
        handleClose()
    }
    return (
        <Dialog open={open} onClose={handleClose}>
            <Box height={6} bgcolor='primary.main' />
            <DialogTitle>Are you sure?</DialogTitle>
            <Divider />
            <DialogContent>
                <DialogContentText>Do you really want to log out?</DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color='primary'>
                    No
                </Button>
                <Button onClick={logoutUser} color='error' autoFocus>
                    Yes
                </Button>
            </DialogActions>
        </Dialog>
    )
}
export default LogoutConfirmation
