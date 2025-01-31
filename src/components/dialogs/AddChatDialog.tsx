import React, { useEffect } from 'react'
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
import { Close, People } from '@mui/icons-material'
import NoResult from '../../assets/lottie/no_search_results.json'
import Lottie from 'lottie-react'

import LottieLoading from '../LottieLoading.tsx'
import ItemAddChatResult from '../listItems/ItemAddChatResult.tsx'

export interface SetDetailsDialogProps {
    dialogState: boolean
    setDialogState: React.Dispatch<React.SetStateAction<boolean>>
}

const AddChatDialog: React.FC<SetDetailsDialogProps> = ({ dialogState, setDialogState }) => {
    const searchedUsers = useAddChatsStore((state) => state.searchedUsers)
    const isLoading = useAddChatsStore((state) => state.isLoading)
    const searchUsers = useAddChatsStore((state) => state.searchUsers)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        debounce(() => {
            searchUsers(e.target.value)
        }, 300)()
    }

    const debounce = <T extends (...args: any[]) => void>(func: T, wait: number) => {
        let timeout: ReturnType<typeof setTimeout> | null = null
        return (...args: Parameters<T>) => {
            if (timeout) clearTimeout(timeout)
            timeout = setTimeout(() => {
                func(...args)
            }, wait)
        }
    }

    useEffect(() => {
        //initial search when dialog opens
        searchUsers('')
    }, [searchUsers])

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
            }}
            onClose={() => {
                setDialogState(false)
            }}>
            {/* Accent Bar */}
            <Box height={6} bgcolor='primary.main' />

            <DialogTitle>
                <Stack direction='column' alignItems='center' spacing={2}>
                    <Box sx={{ display: 'flex', width: '100%' }} alignItems={'center'} gap={2}>
                        <Avatar sx={{ bgcolor: 'primary.main', color: 'white' }}>
                            <People />
                        </Avatar>
                        <Typography variant='h5' fontWeight='bold'>
                            Search for people
                        </Typography>
                        <div className={'flex-1'} />
                        <IconButton
                            sx={{ marginRight: '-8px' }}
                            onClick={() => setDialogState(false)}>
                            <Close />
                        </IconButton>
                    </Box>
                </Stack>
            </DialogTitle>
            <Divider />
            <DialogContent>
                <Box display='flex' flexDirection='column' gap={3}>
                    <Stack spacing={1}>
                        <TextField
                            fullWidth
                            label='Search'
                            onChange={handleChange}
                            variant='outlined'
                        />

                        <Typography
                            variant='body2'
                            fontWeight='light'
                            color={'gray'}
                            textAlign={'center'}>
                            Search for people by their username.You can search for Multiple people
                            at the same time.
                        </Typography>
                    </Stack>
                </Box>
            </DialogContent>

            <DialogContent
                sx={{
                    height: '50vh',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'start',
                    alignItems: 'center',
                    padding: '0px',
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
                    searchedUsers.map((user) => (
                        <ItemAddChatResult
                            key={user.username}
                            user={user}
                            setDialogueState={setDialogState}
                        />
                    ))
                )}
            </DialogContent>
        </Dialog>
    )
}

export default AddChatDialog
