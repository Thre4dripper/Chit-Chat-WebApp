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
    Button,
} from '@mui/material'
import { Close, People } from '@mui/icons-material'
import Lottie from 'lottie-react'
import NoResult from '../../assets/lottie/no_search_results.json'
import LottieLoading from '../LottieLoading.tsx'
import useGroupChatUsersStore from '../../store/add.group.store.ts'
import useGroupChatStore from '../../store/group.chat.store.ts'
import ChatModel from '../../models/user.chat.model.ts'
import { enqueueSnackbar } from 'notistack'
import useHomeStore from '../../store/home.store.ts'
import { SuccessMessages } from '../../constants/SuccessMessages.ts'
import { ErrorMessages } from '../../constants/ErrorMessages.ts'

export interface SetDetailsDialogProps {
    dialogState: boolean
    setDialogState: React.Dispatch<React.SetStateAction<boolean>>
}

const GroupChatDialog: React.FC<SetDetailsDialogProps> = ({ dialogState, setDialogState }) => {
    const searchedUsers = useGroupChatUsersStore((state) => state.searchedUsers)
    const isLoading = useGroupChatUsersStore((state) => state.isLoading)
    const searchUsers = useGroupChatUsersStore((state) => state.searchUsers)
    const loggedInUsername = useHomeStore.getState().user?.username
    const createGroupChat = useGroupChatStore((state) => state.createGroupChat)
    const isCreating = useGroupChatStore((state) => state.isCreating)
    const [selectedUsers, setSelectedUsers] = useState<ChatModel[]>([])
    const [step, setStep] = useState(1)
    const [groupName, setGroupName] = useState('')
    const [groupIcon, setGroupIcon] = useState<File | null>(null)

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
        if (dialogState) {
            searchUsers('')
            setStep(1)
            setSelectedUsers([])
            setGroupName('')
            setGroupIcon(null)
        }
    }, [dialogState, searchUsers])

    const toggleSelect = (chat: ChatModel) => {
        const exists = selectedUsers.some((c) => c.chatId === chat.chatId)

        if (exists) {
            setSelectedUsers((prev) => prev.filter((c) => c.chatId !== chat.chatId))
        } else {
            setSelectedUsers((prev) => [...prev, chat])
        }
    }

    const handleCreateGroup = () => {
        if (!groupName.trim()) return

        createGroupChat(groupName, groupIcon, selectedUsers, (success) => {
            if (success) {
                enqueueSnackbar(SuccessMessages.GROUP_CREATED_SUCCESSFULLY, {
                    variant: 'success',
                    anchorOrigin: { vertical: 'bottom', horizontal: 'right' },
                })
                setDialogState(false)
            } else {
                enqueueSnackbar(ErrorMessages.ERROR_CREATING_GROUP, {
                    variant: 'error',
                    anchorOrigin: { vertical: 'bottom', horizontal: 'right' },
                })
            }
        })
    }

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
            onClose={() => setDialogState(false)}>
            <Box height={6} bgcolor='primary.main' />

            <DialogTitle>
                <Stack direction='row' alignItems='center'>
                    <Avatar sx={{ bgcolor: 'primary.main', color: 'white' }}>
                        <People />
                    </Avatar>
                    <Typography variant='h5' fontWeight='bold' ml={2}>
                        {step === 1 ? 'Add Friends to Group' : 'Group Info'}
                    </Typography>
                    <Box flexGrow={1} />
                    <IconButton onClick={() => setDialogState(false)}>
                        <Close />
                    </IconButton>
                </Stack>
            </DialogTitle>

            <Divider />

            <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                {step === 1 ? (
                    <>
                        <TextField label='Search' fullWidth onChange={handleChange} />
                        <Typography variant='body2' textAlign='center' color='gray'>
                            Select at least 2 people to start a group
                        </Typography>

                        <Box
                            sx={{
                                maxHeight: '45vh',
                                overflowY: 'auto',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 1,
                            }}>
                            {isLoading ? (
                                <LottieLoading />
                            ) : searchedUsers.length === 0 ? (
                                <Lottie
                                    className='max-h-[200px] max-w-[200px]'
                                    animationData={NoResult}
                                    loop
                                    autoPlay
                                />
                            ) : (
                                searchedUsers.map((user) => {
                                    const selected = selectedUsers.some(
                                        (u) => u === user
                                    )
                                    return (
                                        <Box
                                            key={user.chatId}
                                            sx={{
                                                p: 1,
                                                borderRadius: 2,
                                                display: 'flex',
                                                alignItems: 'center',
                                                cursor: 'pointer',
                                                bgcolor: selected ? 'primary.light' : 'transparent',
                                            }}
                                            onClick={() => toggleSelect(user)}>
                                            <Avatar />
                                            <Typography ml={2}>
                                                {user.dmChatUser1.username === loggedInUsername
                                                    ? user.dmChatUser2.username
                                                    : user.dmChatUser1.username}
                                            </Typography>
                                            <Box flexGrow={1} />
                                            {selected && (
                                                <Typography fontSize={12} color='primary'>
                                                    Selected
                                                </Typography>
                                            )}
                                        </Box>
                                    )
                                })
                            )}
                        </Box>
                    </>
                ) : (
                    <>
                        <TextField
                            label='Group Name'
                            value={groupName}
                            onChange={(e) => setGroupName(e.target.value)}
                            required
                        />
                        <Button variant='outlined' component='label'>
                            Upload Group Icon
                            <input
                                hidden
                                accept='image/*'
                                type='file'
                                onChange={(e) => setGroupIcon(e.target.files?.[0] || null)}
                            />
                        </Button>
                        {groupIcon && (
                            <Typography variant='body2' color='gray'>
                                Selected: {groupIcon.name}
                            </Typography>
                        )}
                    </>
                )}
            </DialogContent>

            <Divider />

            <Box display='flex' justifyContent='flex-end' gap={1} p={2}>
                {step === 2 && (
                    <Button variant='outlined' onClick={() => setStep(1)}>
                        Back
                    </Button>
                )}
                {step === 1 ? (
                    <Button
                        variant='contained'
                        disabled={selectedUsers.length < 2}
                        onClick={() => setStep(2)}>
                        Next
                    </Button>
                ) : (
                    <Button
                        variant='contained'
                        disabled={!groupName.trim() || isCreating}
                        onClick={handleCreateGroup}>
                        {isCreating ? 'Creating...' : 'Create Group'}
                    </Button>
                )}
            </Box>
        </Dialog>
    )
}

export default GroupChatDialog
