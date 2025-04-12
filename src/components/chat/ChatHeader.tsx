import CircularImage from '../CircularImage.tsx'
import { IconButton, Popper, ClickAwayListener, Paper, ListItem, ListItemText } from '@mui/material'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import React, { useRef, useState } from 'react'
import useChatDetailsStore from '../../store/chat.details.store.ts'
import useLocalStore from '../../store/local.store.ts'
import DeleteChatConfirmDialog from '../dialogs/DeleteChatConfirmDialog.tsx'

type FeatureType =
{ id: number; content: string; action: () => void }

const ChatHeader: React.FC = () => {
    const currentChat = useChatDetailsStore((state) => state.chatDetails)
    const username = useLocalStore((state) => state.username)
    const [openViewContent, setOpenViewContent] = useState(false)
    const popperRef = useRef(null)

    const [openConfirmDelete, setOpenConfirmDelete] = useState(false)
    if (!currentChat) return <></>

    const viewContactAction = () => {
        setOpenViewContent(false)
    }
    const favoriteAction = () => {
        setOpenViewContent(true)
    }
    const clearAction = () => {
        setOpenViewContent(false)
    }
    const deleteAction = () => {
        setOpenConfirmDelete(true)
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
            <CircularImage
                image={
                    currentChat?.dmChatUser2.username === username
                        ? currentChat?.dmChatUser1.profileImage
                        : currentChat?.dmChatUser2.profileImage
                }
                size={48}
            />
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
                    <IconButton onClick={() => setOpenViewContent((prev) => !prev)}>
                        <MoreVertIcon className={'text-gray-500'} />
                    </IconButton>
                </div>
            </div>
            <Popper
                open={openViewContent}
                anchorEl={popperRef.current}
                placement='right'
                disablePortal>
                <ClickAwayListener onClickAway={() => setOpenViewContent(false)}>
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
        <DeleteChatConfirmDialog
                open={openConfirmDelete}
                handleClose={() => setOpenConfirmDelete(false)}
                message="Are you sure you want to Delete?"
        />
    </>
    )
}

export default ChatHeader
