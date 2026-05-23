import CircularImage from '../CircularImage.tsx'
import { IconButton, Popper, ClickAwayListener, Paper, ListItem, ListItemText } from '@mui/material'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import React, { useRef, useState, useEffect } from 'react'
import useChatDetailsStore from '../../store/chat.details.store.ts'
import useChatProfileStore from '../../store/chat.profile.store.ts'
import useLocalStore from '../../store/local.store.ts'
import ConfirmDialog from '../dialogs/ConfirmDialog.tsx'
import useHomeStore from '../../store/home.store.ts'
import { enqueueSnackbar } from 'notistack'
import { ErrorMessages } from '../../constants/ErrorMessages.ts'
import { SuccessMessages } from '../../constants/SuccessMessages.ts'
type FeatureType = { id: number; content: string; action: () => void }

/** Converts a raw Firestore status string into a display label and colour class. */
function parseStatus(raw: string): { label: string; colour: string } {
    if (raw === 'Online') return { label: 'Online', colour: 'text-green-500' }
    if (raw.startsWith('LastSeen')) {
        const seconds = parseInt(raw.replace('LastSeen', ''), 10)
        if (!isNaN(seconds)) {
            const date = new Date(seconds * 1000)
            const now = new Date()
            const isToday =
                date.getDate() === now.getDate() &&
                date.getMonth() === now.getMonth() &&
                date.getFullYear() === now.getFullYear()
            const timeStr = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })
            const label = isToday
                ? `Last seen at ${timeStr}`
                : `Last seen ${date.toLocaleDateString([], { month: 'short', day: 'numeric' })} at ${timeStr}`
            return { label, colour: 'text-yellow-500' }
        }
    }
    return { label: raw, colour: 'text-gray-400' }
}

const ChatHeader: React.FC = () => {
    //  zustand states
    const currentChat = useChatDetailsStore((state) => state.chatDetails)
    const setIsViewingProfile = useChatDetailsStore((state) => state.setIsViewingProfile)
    const username = useLocalStore((state) => state.username)
    const user = useHomeStore((state) => state.user)
    const setUser = useHomeStore((state) => state.setUser)
    const currentChatId = useChatDetailsStore((state) => state.currentChatId)
    const deleteChat = useChatDetailsStore((state) => state.deleteChat)
    const clearChat = useChatDetailsStore((state) => state.clearChat)
    const markFavourite = useChatDetailsStore((state) => state.favouriteChat)
    const partnerStatus = useChatProfileStore((state) => state.partnerStatus)
    const subscribePartnerStatus = useChatProfileStore((state) => state.subscribePartnerStatus)

    const [openPopper, setOpenPopper] = useState(false)
    const popperRef = useRef(null)

    const { label: statusLabel, colour: statusColour } = parseStatus(partnerStatus)

    //  confirm box
    const [title, setTitle] = useState<string>('')
    const [message, setMessage] = useState('')
    const [openDialog, setOpenDialog] = useState(false)
    const [actionDetails, setActionDetails] = useState<1 | 2 | 3 | 4 | null>(null)

    // Subscribe to partner status via store (mirrors ChatViewModel.listenUserStatus)
    useEffect(() => {
        if (!currentChat || !username) return
        const unsubscribe = subscribePartnerStatus(currentChat, username)
        return () => unsubscribe()
    }, [currentChat, username])

    if (!currentChat) return <></>

    const viewContactAction = () => {
        setOpenPopper(false)
        setIsViewingProfile(true)
        setActionDetails(1)
    }
    const favoriteAction = () => {
        setOpenPopper(false)
        setMessage('Are you sure you want to update your favourites?')
        setTitle('Favourite')
        setActionDetails(2)
        setOpenDialog(true)
    }
    const clearAction = () => {
        setOpenPopper(false)
        setMessage('Are you sure you want to clear this chat?')
        setTitle('Clear chat')
        setActionDetails(3)
        setOpenDialog(true)
    }
    const deleteAction = () => {
        setOpenPopper(false)
        setMessage('Are you sure you want to delete this chat?')
        setTitle('Delete chat')
        setActionDetails(4)
        setOpenDialog(true)
    }
    const action = () => {
        setOpenDialog(false)

        //  view contact
        if (actionDetails === 1) {
            console.log('working on view model')
        } else if (actionDetails === 2) {
            if (!user || !currentChatId) {
                console.log('Something wrong in chatId in Favourite')
                enqueueSnackbar(ErrorMessages.ERROR_UPDATING_FAVOURITE, {
                    variant: 'error',
                    autoHideDuration: 3000,
                })
                return
            }
            markFavourite(user, currentChatId, (done) => {
                if (!done) {
                    enqueueSnackbar(ErrorMessages.ERROR_UPDATING_FAVOURITE, {
                        variant: 'error',
                        autoHideDuration: 3000,
                    })
                    return
                }
                const wasAlreadyFavourite = user.favourites.includes(currentChatId)
                setUser(done)
                console.log('favourite updated')
                enqueueSnackbar(
                    wasAlreadyFavourite
                        ? SuccessMessages.FAVOURITE_CLEARED_SUCCESSFULLY
                        : SuccessMessages.FAVOURITE_MARKED_SUCCESSFULLY,
                    { variant: 'success', autoHideDuration: 3000 }
                )
            })
        } else if (actionDetails === 3) {
            clearChat(currentChat, (success) => {
                if (!success) {
                    enqueueSnackbar(ErrorMessages.ERROR_CLEARING_CHAT, {
                        variant: 'error',
                        autoHideDuration: 3000,
                    })
                    return
                }
                enqueueSnackbar(SuccessMessages.CHAT_CLEARED_SUCCESSFULLY, {
                    variant: 'success',
                    autoHideDuration: 3000,
                })
            })
        } else if (actionDetails === 4) {
            deleteChat(currentChat, (success) => {
                if (!success) {
                    enqueueSnackbar(ErrorMessages.ERROR_DELETING_CHAT, {
                        variant: 'error',
                        autoHideDuration: 3000,
                    })
                    return
                }
                enqueueSnackbar(SuccessMessages.CHAT_DELETED_SUCCESSFULLY, {
                    variant: 'success',
                    autoHideDuration: 3000,
                })
            })
        }
    }

    const ListFeatures: FeatureType[] = [
        {
            id: 1,
            content: 'View Contact',
            action: viewContactAction,
        },
        {
            id: 2,
            content: 'Favorite',
            action: favoriteAction,
        },
        {
            id: 3,
            content: 'Clear Chat',
            action: clearAction,
        },
        {
            id: 4,
            content: 'Delete Chat',
            action: deleteAction,
        },
    ]

    return (
        <>
            <div
                className={
                    'z-50 bg-slate-300 rounded-3xl shadow-slate-950/20 shadow-md flex flex-row px-4 pt-4 pb-2 relative'
                }>
                <IconButton
                    onClick={() => {
                        setIsViewing(true)
                    }}>
                    <CircularImage
                        image={
                            currentChat?.dmChatUser2.username === username
                                ? currentChat?.dmChatUser1.profileImage
                                : currentChat?.dmChatUser2.profileImage
                        }
                        size={48}
                    />
                </IconButton>
                <div className={'mx-4 flex flex-col flex-auto justify-center'}>
                    <div className={'flex flex-row justify-between'}>
                        <span className={'text-black text-lg font-bold'}>
                            {currentChat?.dmChatUser2.username === username
                                ? currentChat?.dmChatUser1.username
                                : currentChat?.dmChatUser2.username}
                        </span>
                    </div>
                    <div className={'flex flex-row items-center gap-1'}>
                        <span className={`w-2 h-2 rounded-full ${partnerStatus === 'Online' ? 'bg-green-500' : 'bg-yellow-500'}`} />
                        <span className={`font-medium text-sm ${statusColour}`}>{statusLabel}</span>
                    </div>
                </div>
                <div>
                    <div className={'mt-2'} ref={popperRef}>
                        <IconButton onClick={() => setOpenPopper((prev) => !prev)}>
                            <MoreVertIcon className={'text-gray-500'} />
                        </IconButton>
                    </div>
                </div>
                <Popper
                    open={openPopper}
                    anchorEl={popperRef.current}
                    placement='right'
                    disablePortal>
                    <ClickAwayListener onClickAway={() => setOpenPopper(false)}>
                        <Paper
                            elevation={3}
                            sx={{
                                zIndex: 100,
                                margin: '20px',
                                position: 'relative',
                                cursor: 'pointer',
                            }}>
                            {ListFeatures.map((feature) => (
                                <ListItem key={feature.id} onClick={feature.action}>
                                    <ListItemText primary={`${feature.content}`} />
                                </ListItem>
                            ))}
                        </Paper>
                    </ClickAwayListener>
                </Popper>
            </div>
            <ConfirmDialog
                open={openDialog}
                handleClose={() => setOpenDialog(false)}
                title={title}
                message={message}
                action={action}
            />
        </>
    )
}

export default ChatHeader
