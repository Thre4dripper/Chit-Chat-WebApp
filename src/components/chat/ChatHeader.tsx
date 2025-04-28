import CircularImage from '../CircularImage.tsx'
import { IconButton, Popper, ClickAwayListener, Paper, ListItem, ListItemText } from '@mui/material'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import React, { SetStateAction, useRef, useState } from 'react'
import useChatDetailsStore from '../../store/chat.details.store.ts'
import useLocalStore from '../../store/local.store.ts'
import ConfirmDialog from '../dialogs/ConfirmDialog.tsx'
import useHomeStore from '../../store/home.store.ts'
import {enqueueSnackbar} from 'notistack'

type FeatureType = { id: number; content: string; action: () => void }

const ChatHeader: React.FC<{ setIsViewing: React.Dispatch<SetStateAction<boolean>> }> = ({
    setIsViewing,
}) => {
    //  zustand states
    const currentChat = useChatDetailsStore((state) => state.chatDetails)
    const username = useLocalStore((state) => state.username)
    const user = useHomeStore((state) => state.user)
    const setUser = useHomeStore((state) => state.setUser)
    const currentChatId = useChatDetailsStore((state) => state.currentChatId)
    const deleteChat = useChatDetailsStore((state) => state.deleteChat)
    const clearChat = useChatDetailsStore((state) => state.clearChat)
    const markFavourite = useChatDetailsStore((state) => state.favouriteChat)

    const [openPopper, setOpenPopper] = useState(false)
    const popperRef = useRef(null)

    //  confirm box
    const [title, setTitle] = useState<string>('')
    const [message, setMessage] = useState('')
    const [openDialog, setOpenDialog] = useState(false)
    const [actionDetails, setActionDetails] = useState<1 | 2 | 3 | 4 | null>(null)

    if (!currentChat) return <></>

    const viewContactAction = () => {
        setOpenPopper(false)
        setIsViewing(true)
        setActionDetails(1)
    }
    const favoriteAction = () => {
        setOpenPopper(false)
        setMessage('Are you sure you want to Add into Favorites?')
        setTitle('Add To Favorites')
        setActionDetails(2)
        setOpenDialog(true)
    }
    const clearAction = () => {
        setOpenPopper(false)
        setMessage('Are you sure you want to Clear Chats?')
        setTitle('Clear Chat')
        setActionDetails(3)
        setOpenDialog(true)
    }
    const deleteAction = () => {
        setOpenPopper(false)
        setMessage('Are you sure you want to Delete Chats?')
        setTitle('Delete Chat')
        setActionDetails(4)
        setOpenDialog(true)
    }
    const action = () => {
        setOpenDialog(false)

        //  view contact
        if (actionDetails === 1) {
            console.log('working on view model')
        }
        //  favourite add remove
        else if (actionDetails === 2) {
            if (!user || !currentChatId) {
                enqueueSnackbar('Something wrong in chatId in Favourite',{variant:'error',autoHideDuration:3000})
                return
            }
            markFavourite(user, currentChatId, (done) => {
                if (!done) {
                    enqueueSnackbar('Something wrong in chatId in Favourite',{variant:'error',autoHideDuration:3000})
                    return
                }
                setUser(done)
                console.log('wtf you did this omg')
            })
        }
        //  clear Chats
        else if (actionDetails === 3) {
            clearChat(currentChat, (sucesss) => {
                if (!sucesss) enqueueSnackbar('Something wrong in Clear Chat',{variant:'error',autoHideDuration:3000})
            })
        }
        //  delete chats
        else if (actionDetails === 4) {
            deleteChat(currentChat, (sucesss) => {
                if (!sucesss) enqueueSnackbar('Something wrong in Delete Chat',{variant:'error',autoHideDuration:3000})
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
                    <div className={'flex flex-row justify-between'}>
                        <span className={'text-green-600 font-medium text-sm'}>{'Online'}</span>
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
