import React, { useEffect, useState } from 'react'
import {
    Avatar,
    Dialog,
    TextField,
    DialogContent,
    DialogTitle,
    Divider,
    Typography,
    Stack,
    Box,
    IconButton,
} from '@mui/material'
import MutableLiveDataStore from '../../store/MutableLiveData.store'
import { Send, Close } from '@mui/icons-material'
import UserModel from '../../models/user.model'
import AddChatsRepository from '../../repositories/AddChats.repository'

export interface DialogState {
    //  we can also use Dialog of userDetails But for now we are using this
    open: boolean
    type: string
    value: string
    error: boolean
}
interface SetDetailsDialogProps {
    dialogState: DialogState
    setDialogState: React.Dispatch<React.SetStateAction<DialogState>>
}

const AddChatDialog: React.FC<SetDetailsDialogProps> = ({ dialogState, setDialogState }) => {
    const { open } = dialogState

    const [totalusers, setTotalUsers] = useState<UserModel[]>([])
    const [debouncedSearch, setDebouncedSearch] = useState(dialogState.value)
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(dialogState.value)
        }, 300) // 300ms debounce delay

        return () => clearTimeout(timer)
    }, [dialogState.value])

    useEffect(() => {
        if (debouncedSearch !== undefined) {
            AddChatsRepository.searchUsers(debouncedSearch)
        }
    }, [debouncedSearch])

    useEffect(() => {
        const unsubscribe = MutableLiveDataStore.subscribe((state) => {
            const newSearchResult = state.searchResult
            setTotalUsers(newSearchResult)
        })

        // Cleanup the subscription when the component unmounts
        return () => unsubscribe()
    }, [])

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
                    <Box
                        sx={{ display: 'flex' }}
                        alignItems='center'
                        justifyContent='center'
                        gap={2}>
                        <Typography variant='h5' fontWeight='bold'>
                            Search for people
                        </Typography>
                        <IconButton
                            sx={{ position: 'absolute', right: '0px' }}
                            onClick={() => setDialogState({ ...dialogState, open: false })}>
                            <Close />
                        </IconButton>
                    </Box>

                    <Typography variant='body2' fontWeight='light'>
                        Search for people by their username.You can search for Multiple people at
                        the same time.
                    </Typography>
                </Stack>
            </DialogTitle>

            <Divider />

            <DialogContent>
                <Box display='flex' flexDirection='column' gap={3}>
                    {/* Input Section */}
                    <Stack spacing={1}>
                        <TextField
                            fullWidth
                            label='search'
                            value={dialogState.value}
                            onChange={(e) =>
                                setDialogState({ ...dialogState, value: e.target.value })
                            }
                            variant='outlined'
                            helperText={dialogState.error ? 'No Username Found' : ''}
                            error={!!dialogState.error}
                        />
                    </Stack>
                </Box>
            </DialogContent>

            <DialogContent sx={{ maxHeight: '30vh', overflowY: 'auto' }}>
                {totalusers.length > 0 &&
                    totalusers.map((user) => {
                        return (
                            <Box
                                key={user.username}
                                sx={{
                                    'display': 'flex',
                                    'alignItems': 'center',
                                    'position': 'relative',
                                    'justifyContent': 'start',
                                    'marginX': 4,
                                    'gap': 2,
                                    'borderRadius': 4,
                                    'cursor': 'pointer',
                                    '&:hover': {
                                        backgroundColor: '#f5f3f3',
                                    },
                                }}
                                onClick={() => {
                                    setDialogState({ ...dialogState, open: false })
                                }}>
                                <Avatar
                                    src={user.profileImage}
                                    sx={{ bgcolor: 'primary.main', color: 'white' }}></Avatar>
                                <Box>
                                    <Typography variant='h6' fontWeight='medium'>
                                        {user.username}
                                    </Typography>
                                    <Typography variant='body2' fontWeight='light'>
                                        {user.name.slice(0, 15).concat('..')}
                                    </Typography>
                                </Box>
                                <IconButton
                                    sx={{ position: 'absolute', right: '0px' }}
                                    onClick={() => {
                                        setDialogState({ ...dialogState, open: false })
                                    }}>
                                    <Send />
                                </IconButton>
                            </Box>
                        )
                    })}
            </DialogContent>
        </Dialog>
    )
}

export default AddChatDialog
