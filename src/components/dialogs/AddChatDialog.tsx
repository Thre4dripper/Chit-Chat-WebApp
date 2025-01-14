import React, { useState } from 'react'
import {
    Avatar,
    Dialog,
    DialogActions,
    TextField,
    DialogContent,
    DialogTitle,
    Divider,
    Typography,
    Stack,
    Box,
    IconButton,
} from '@mui/material'

import { Send } from '@mui/icons-material'
import { DialogState } from '../../fragments/profile/UserProfileFragment'





interface SetDetailsDialogProps {
    dialogState: DialogState
    setDialogState: React.Dispatch<React.SetStateAction<DialogState>>
}

const AddChatDialog: React.FC<SetDetailsDialogProps> = ({ dialogState, setDialogState }) => {
    const { open } = dialogState
    const [searchValue, setSearchValue] = useState({ value: '', error: '' });
    const [loading, setLoading] = useState(false)
    const [totalusers, setTotalUsers] = useState([
        {
            username: 'username',
            name: 'name'
        },
        {
            username: 'username',
            name: 'name'
        },
        {
            username: 'username',
            name: 'name'
        },
        {
            username: 'username',
            name: 'name'
        },
        {
            username: 'username',
            name: 'name'
        }
    ])
  
    return (
        <Dialog
            fullWidth
            maxWidth='sm'
            open={open}
            sx={{
                '& .MuiDialog-paper': {
                    borderRadius: 4,
                    overflow: 'hidden',
                },
            }}>
            {/* Accent Bar */}
            <Box height={6} bgcolor='primary.main' />

            <DialogTitle>
                <Stack direction='column' alignItems='center' spacing={2}>
                    {/* <Avatar sx={{ bgcolor: 'primary.main', color: 'white' }}></Avatar> */}
                    <Typography variant='h5' fontWeight='bold'>
                        Search for people
                    </Typography>
                    <Typography variant='body2' fontWeight='light'>
                        Search for people by their username.You can search for Multiple people at the same time.
                    </Typography>
                </Stack>
            </DialogTitle>

            <Divider />

            <DialogContent>
                <Box my={2} display='flex' flexDirection='column' gap={3}>
                    {/* Input Section */}
                    <Stack spacing={1}>

                        <TextField
                            fullWidth
                            label='search'
                            value={searchValue.value}
                            onChange={(e) => setSearchValue({ ...searchValue, value: e.target.value })}
                            variant='outlined'
                            helperText={searchValue.error ? 'No Username Found' : ''}
                            error={!!searchValue.error}
                        />

                    </Stack>
                </Box>
            </DialogContent>

            <DialogContent sx={{maxHeight: '30vh', overflowY: 'auto'}}>
                {totalusers.map((user, index) => {
                return <Box key={index} my={2} display='flex' justifyContent='space-around' alignItems='center' gap={3}>
                    <Box display='flex' alignItems='center' gap={2}>
                        <Avatar sx={{ bgcolor: 'primary.main', color: 'white' }}></Avatar>
                        <Box>
                            <Typography variant='h5' fontWeight='medium'>{user.username}</Typography>
                            <Typography variant='body2' fontWeight='light'> {user.name}</Typography>
                        </Box>
                    </Box>
                    <IconButton onClick={() => { setDialogState({ ...dialogState, open: false }) }} ><Send /></IconButton>
                </Box>
                })}
            </DialogContent>
        </Dialog>
    )
}

export default AddChatDialog
