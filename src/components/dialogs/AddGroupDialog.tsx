import React, { useEffect, useRef, useState } from 'react'
import {
    Avatar,
    Badge,
    Chip,
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
import { CameraAlt, CheckCircle, Close, People } from '@mui/icons-material'
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

const NAVY = '#1D2C48'

const formatStatus = (status: string): string => {
    if (status === 'Online') return 'Online'
    if (status.startsWith('LastSeen')) {
        const ts = parseInt(status.slice(8), 10)
        if (!isNaN(ts)) {
            const date = new Date(ts * 1000)
            const now = new Date()
            const isToday = date.toDateString() === now.toDateString()
            const time = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            if (isToday) return `Last seen today at ${time}`
            const yesterday = new Date(now)
            yesterday.setDate(yesterday.getDate() - 1)
            if (date.toDateString() === yesterday.toDateString()) return `Last seen yesterday at ${time}`
            return `Last seen ${date.toLocaleDateString([], { month: 'short', day: 'numeric' })} at ${time}`
        }
    }
    return status
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
    const [groupIconPreview, setGroupIconPreview] = useState<string | null>(null)
    const iconInputRef = useRef<HTMLInputElement>(null)

    const debounce = <T extends (...args: any[]) => void>(func: T, wait: number) => {
        let timeout: ReturnType<typeof setTimeout> | null = null
        return (...args: Parameters<T>) => {
            if (timeout) clearTimeout(timeout)
            timeout = setTimeout(() => func(...args), wait)
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        debounce(() => searchUsers(e.target.value), 300)()
    }

    useEffect(() => {
        if (dialogState) {
            searchUsers('')
            setStep(1)
            setSelectedUsers([])
            setGroupName('')
            setGroupIcon(null)
            setGroupIconPreview(null)
        }
    }, [dialogState, searchUsers])

    const toggleSelect = (chat: ChatModel) => {
        setSelectedUsers((prev) =>
            prev.some((c) => c.chatId === chat.chatId)
                ? prev.filter((c) => c.chatId !== chat.chatId)
                : [...prev, chat]
        )
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

    const getOtherUser = (chat: ChatModel) =>
        chat.dmChatUser1.username === loggedInUsername ? chat.dmChatUser2 : chat.dmChatUser1

    return (
        <Dialog
            fullWidth
            maxWidth='sm'
            open={dialogState}
            sx={{ '& .MuiDialog-paper': { borderRadius: 3, overflow: 'hidden' } }}
            onClose={() => setDialogState(false)}>

            {/* Navy accent bar */}
            <Box sx={{ height: 4, bgcolor: NAVY }} />

            {/* Header */}
            <DialogTitle sx={{ py: 1.5, px: 2.5, bgcolor: 'background.paper' }}>
                <Stack direction='row' sx={{ alignItems: 'center', gap: 1.5 }}>
                    <Avatar sx={{ bgcolor: NAVY, width: 36, height: 36 }}>
                        <People sx={{ fontSize: 20 }} />
                    </Avatar>
                    <Box>
                        <Typography sx={{ fontWeight: 600, lineHeight: 1.2 }}>
                            {step === 1 ? 'New Group' : 'Group Details'}
                        </Typography>
                        <Typography variant='caption' sx={{ color: 'text.secondary' }}>
                            Step {step} of 2
                        </Typography>
                    </Box>
                    <Box sx={{ flexGrow: 1 }} />
                    <IconButton size='small' onClick={() => setDialogState(false)}>
                        <Close fontSize='small' />
                    </IconButton>
                </Stack>
            </DialogTitle>

            <Divider />

            <DialogContent sx={{ p: 0, display: 'flex', flexDirection: 'column' }}>
                {step === 1 ? (
                    <>
                        {/* Selected chips */}
                        {selectedUsers.length > 0 && (
                            <Box
                                sx={{
                                    display: 'flex',
                                    flexWrap: 'wrap',
                                    gap: 0.75,
                                    px: 2,
                                    py: 1.25,
                                    borderBottom: '1px solid',
                                    borderColor: 'divider',
                                    bgcolor: '#f8fafd',
                                }}>
                                {selectedUsers.map((chat) => {
                                    const other = getOtherUser(chat)
                                    return (
                                        <Chip
                                            key={chat.chatId}
                                            avatar={
                                                <Avatar src={other.profileImage}>
                                                    {other.username[0].toUpperCase()}
                                                </Avatar>
                                            }
                                            label={other.username}
                                            onDelete={() => toggleSelect(chat)}
                                            size='small'
                                            sx={{
                                                bgcolor: 'white',
                                                border: '1px solid',
                                                borderColor: 'divider',
                                                fontWeight: 500,
                                                '& .MuiChip-deleteIcon': { color: 'text.secondary' },
                                            }}
                                        />
                                    )
                                })}
                            </Box>
                        )}

                        {/* Search */}
                        <Box sx={{ px: 2, pt: 2, pb: 0.5 }}>
                            <TextField
                                placeholder='Search by username...'
                                fullWidth
                                size='small'
                                onChange={handleChange}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: 2.5,
                                        bgcolor: '#f5f7fa',
                                        '& fieldset': { borderColor: 'transparent' },
                                        '&:hover fieldset': { borderColor: 'divider' },
                                        '&.Mui-focused fieldset': { borderColor: NAVY },
                                    },
                                }}
                            />
                        </Box>
                        <Typography
                            variant='caption'
                            sx={{ color: 'text.disabled', display: 'block', textAlign: 'center', py: 0.75 }}>
                            Select at least 2 people to create a group
                        </Typography>

                        {/* User list */}
                        <Box sx={{ maxHeight: '42vh', overflowY: 'auto', pb: 1 }}>
                            {isLoading ? (
                                <LottieLoading />
                            ) : searchedUsers.length === 0 ? (
                                <Lottie className='max-h-50 max-w-50' animationData={NoResult} loop autoPlay />
                            ) : (
                                searchedUsers.map((chat) => {
                                    const other = getOtherUser(chat)
                                    const selected = selectedUsers.some((u) => u.chatId === chat.chatId)
                                    const isOnline = other.status === 'Online'
                                    const statusText = formatStatus(other.status)

                                    return (
                                        <Box
                                            key={chat.chatId}
                                            onClick={() => toggleSelect(chat)}
                                            sx={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: 1.5,
                                                px: 2,
                                                py: 1,
                                                cursor: 'pointer',
                                                borderLeft: selected ? `3px solid ${NAVY}` : '3px solid transparent',
                                                bgcolor: selected ? 'rgba(29,44,72,0.05)' : 'transparent',
                                                '&:hover': { bgcolor: selected ? 'rgba(29,44,72,0.07)' : 'rgba(0,0,0,0.03)' },
                                                transition: 'background 0.12s, border-color 0.12s',
                                            }}>
                                            {/* Avatar with online indicator */}
                                            <Badge
                                                overlap='circular'
                                                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                                                badgeContent={
                                                    isOnline ? (
                                                        <Box sx={{ width: 10, height: 10, bgcolor: '#4caf50', borderRadius: '50%', border: '2px solid white' }} />
                                                    ) : null
                                                }>
                                                <Avatar src={other.profileImage} sx={{ width: 46, height: 46 }}>
                                                    {other.username[0].toUpperCase()}
                                                </Avatar>
                                            </Badge>

                                            {/* Name + status */}
                                            <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                                                <Typography sx={{ fontWeight: 500, fontSize: '0.9rem', lineHeight: 1.3 }} noWrap>
                                                    {other.username}
                                                </Typography>
                                                <Typography
                                                    variant='caption'
                                                    noWrap
                                                    sx={{ color: isOnline ? '#4caf50' : 'text.secondary', display: 'block' }}>
                                                    {statusText}
                                                </Typography>
                                            </Box>

                                            {/* Check icon */}
                                            {selected && (
                                                <CheckCircle sx={{ color: NAVY, fontSize: 22, flexShrink: 0 }} />
                                            )}
                                        </Box>
                                    )
                                })
                            )}
                        </Box>
                    </>
                ) : (
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2.5, px: 3, py: 3 }}>
                        {/* Group icon picker */}
                        <Box
                            onClick={() => iconInputRef.current?.click()}
                            sx={{ position: 'relative', cursor: 'pointer', '&:hover .cam-overlay': { opacity: 1 } }}>
                            <Avatar src={groupIconPreview ?? undefined} sx={{ width: 96, height: 96, bgcolor: NAVY }}>
                                <People sx={{ fontSize: 48 }} />
                            </Avatar>
                            <Box
                                className='cam-overlay'
                                sx={{
                                    position: 'absolute', inset: 0, borderRadius: '50%',
                                    bgcolor: 'rgba(0,0,0,0.45)', display: 'flex',
                                    alignItems: 'center', justifyContent: 'center',
                                    opacity: 0, transition: 'opacity 0.2s',
                                }}>
                                <CameraAlt sx={{ color: 'white', fontSize: 28 }} />
                            </Box>
                            <input
                                hidden ref={iconInputRef} accept='image/*' type='file'
                                onChange={(e) => {
                                    const file = e.target.files?.[0] || null
                                    setGroupIcon(file)
                                    setGroupIconPreview(file ? URL.createObjectURL(file) : null)
                                }}
                            />
                        </Box>
                        <Typography variant='caption' sx={{ color: 'text.secondary', mt: -1 }}>
                            Tap to set group icon (optional)
                        </Typography>

                        <TextField
                            label='Group Name'
                            value={groupName}
                            onChange={(e) => setGroupName(e.target.value)}
                            required
                            fullWidth
                            sx={{ '& .MuiOutlinedInput-root.Mui-focused fieldset': { borderColor: NAVY }, '& label.Mui-focused': { color: NAVY } }}
                        />

                        {/* Members preview */}
                        <Box sx={{ width: '100%', bgcolor: '#f8fafd', borderRadius: 2, p: 1.5 }}>
                            <Typography variant='caption' sx={{ color: 'text.secondary', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                                {selectedUsers.length} Members
                            </Typography>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75, mt: 1 }}>
                                {selectedUsers.map((chat) => {
                                    const other = getOtherUser(chat)
                                    return (
                                        <Chip
                                            key={chat.chatId}
                                            avatar={<Avatar src={other.profileImage}>{other.username[0].toUpperCase()}</Avatar>}
                                            label={other.username}
                                            size='small'
                                            sx={{ bgcolor: 'white', border: '1px solid', borderColor: 'divider' }}
                                        />
                                    )
                                })}
                            </Box>
                        </Box>
                    </Box>
                )}
            </DialogContent>

            <Divider />

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, px: 2, py: 1.5, bgcolor: 'background.paper' }}>
                {step === 2 && (
                    <Button variant='outlined' onClick={() => setStep(1)} sx={{ borderColor: NAVY, color: NAVY, '&:hover': { borderColor: NAVY, bgcolor: 'rgba(29,44,72,0.05)' } }}>
                        Back
                    </Button>
                )}
                {step === 1 ? (
                    <Button
                        variant='contained'
                        disabled={selectedUsers.length < 2}
                        onClick={() => setStep(2)}
                        sx={{ bgcolor: NAVY, '&:hover': { bgcolor: '#243658' }, '&:disabled': { bgcolor: 'rgba(0,0,0,0.12)' } }}>
                        Next
                    </Button>
                ) : (
                    <Button
                        variant='contained'
                        disabled={!groupName.trim() || isCreating}
                        onClick={handleCreateGroup}
                        sx={{ bgcolor: NAVY, '&:hover': { bgcolor: '#243658' }, '&:disabled': { bgcolor: 'rgba(0,0,0,0.12)' } }}>
                        {isCreating ? 'Creating...' : 'Create Group'}
                    </Button>
                )}
            </Box>
        </Dialog>
    )
}

export default GroupChatDialog
