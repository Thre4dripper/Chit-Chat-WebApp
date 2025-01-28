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
import useAddChatsStore from '../../store/add.chats.store.ts'
import { Send, Close } from '@mui/icons-material'
import NoResult from '../../assets/lottie/no_search_results.json'
import Lottie from 'lottie-react'

import LottieLoading from '../LottieLoading.tsx'

interface SetDetailsDialogProps {
    dialogState: boolean
    setDialogState: React.Dispatch<React.SetStateAction<boolean>>
}

const AddChatDialog: React.FC<SetDetailsDialogProps> = ({ dialogState, setDialogState }) => {
    const [searchUser, setSearchUser] = useState('')
    const searchedUsers = useAddChatsStore((state) => state.searchedUsers)
    const searchUsers = useAddChatsStore((state) => state.searchUsers)
    const isLoading=useAddChatsStore((state)=>state.isLoading)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchUser(e.target.value)
        useAddChatsStore.setState({isLoading:true})
        const timer = setTimeout(() => {
            searchUsers(e.target.value)
        }, 300)
        return () => clearTimeout(timer)
    }
    //  calling all user on component mount
    useEffect(() => {
        searchUsers(searchUser)
    }, [])

    return (
        <Dialog
            fullWidth
            maxWidth='sm'
            open={dialogState}
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
                            onClick={() => setDialogState(false)}>
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
                    <Stack spacing={1}>
                        <TextField
                            fullWidth
                            label='search'
                            value={searchUser}
                            onChange={handleChange}
                            variant='outlined'
                        />
                    </Stack>
                </Box>
            </DialogContent>

            <DialogContent
                sx={{
                    maxHeight: '30vh',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'start',
                    alignItems: 'center',
                }}>
                {isLoading ? (
                    <LottieLoading />
                ) : searchedUsers.length == 0 ? (
                    <Lottie
                        className={'max-h-[200px] max-w-[200px]'}
                        animationData={NoResult}
                        loop={true}
                        autoPlay={true}
                    />
                ) : (
                    searchedUsers.map((user) => {
                        return (
                            <Box
                                key={user.username}
                                sx={{
                                    'minWidth': '90%',
                                    'display': 'flex',
                                    'alignItems': 'center',
                                    'position': 'relative',
                                    'justifyContent': 'start',
                                    'gap': 2,
                                    'borderRadius': 4,
                                    'cursor': 'pointer',
                                    '&:hover': {
                                        backgroundColor: '#f5f3f3',
                                    },
                                }}
                                onClick={() => {
                                    setDialogState(false)
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
                                        setDialogState(false)
                                    }}>
                                    <Send />
                                </IconButton>
                            </Box>
                        )
                    })
                )}
            </DialogContent>
        </Dialog>
    )
}

export default AddChatDialog
