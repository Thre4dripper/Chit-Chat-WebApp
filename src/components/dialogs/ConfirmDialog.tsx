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

interface ConfirmDialogProps {
    open: boolean
    handleClose: () => void
    title: string
    message: string
    action: () => void
    width?: number
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
    open,
    handleClose,
    title,
    message,
    action,
    width,
}) => {
    return (
        <Dialog open={open} onClose={handleClose} fullWidth={!width}>
            <DialogTitle>
                <div className={'flex flex-row items-center justify-start gap-4'}>
                    <Avatar src={'/src/assets/logo.png'} />
                    {title}
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
                <Button onClick={action} color='error'>
                    Yes
                </Button>
            </DialogActions>
        </Dialog>
    )
}
export default ConfirmDialog
