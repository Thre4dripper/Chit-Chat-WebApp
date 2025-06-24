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
import useChatDetailsStore from '../../store/chat.details.store.ts'

interface DeleteChatConfirmDialogProps {
    open: boolean
    handleClose: () => void
    message: string
}

const DeleteChatConfirmDialog: React.FC<DeleteChatConfirmDialogProps> = ({
    open,
    handleClose,
    message,
}) => {
    const chats = useChatDetailsStore((state) => state.chatDetails)
    const deleteChat = useChatDetailsStore((state) => state.deleteChat)
    const DeleteChats = async () => {
        if (!chats) {
            alert('No chats found.')
            return
        }
        deleteChat(chats, (success) => {
            if (!success) alert('not possible to delete')
        })
        handleClose()
    }
    return (
        <Dialog open={open} onClose={handleClose} fullWidth={true}>
            <DialogTitle>
                <div className={'flex flex-row items-center justify-start gap-4'}>
                    <Avatar src={'/src/assets/logo.png'} />
                    Delete Chats
                </div>
            </DialogTitle>
            <Divider />
            <DialogContent>
                <DialogContentText>{message}</DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color='primary'>
                    No
                </Button>
                <Button onClick={DeleteChats} color='error'>
                    Yes
                </Button>
            </DialogActions>
        </Dialog>
    )
}
export default DeleteChatConfirmDialog
