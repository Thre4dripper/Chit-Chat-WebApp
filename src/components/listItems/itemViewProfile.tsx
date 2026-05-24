import { Avatar, IconButton, Typography, Switch, Divider } from '@mui/material'
import {
    Close,
    Favorite,
    FavoriteBorder,
    Clear,
    DeleteOutlined,
    Notifications,
    Group,
} from '@mui/icons-material'
import emptyImageIconData from '../../assets/lottie/no_photos.json'
import Lottie from 'lottie-react'
import React, { useEffect, useState } from 'react'
import useChatDetailsStore from '../../store/chat.details.store.ts'
import useChatProfileStore from '../../store/chat.profile.store.ts'
import useLocalStore from '../../store/local.store.ts'
import useHomeStore from '../../store/home.store.ts'
import ChatUtils from '../../utils/ChatUtils.ts'
import { ChatMessageType } from '../../enums/ChatMessageType.ts'
import { enqueueSnackbar } from 'notistack'
import ConfirmDialog from '../dialogs/ConfirmDialog.tsx'
import ViewImageDialog from '../dialogs/ViewImageDialog.tsx'
import { ErrorMessages } from '../../constants/ErrorMessages.ts'
import { SuccessMessages } from '../../constants/SuccessMessages.ts'
import { useNavigate } from 'react-router'

const ViewProfile: React.FC = () => {
    const currentChat = useChatDetailsStore((state) => state.chatDetails)
    const setIsViewingProfile = useChatDetailsStore((state) => state.setIsViewingProfile)
    const clearChat = useChatDetailsStore((state) => state.clearChat)
    const deleteChat = useChatDetailsStore((state) => state.deleteChat)
    const markFavourite = useChatDetailsStore((state) => state.favouriteChat)
    const username = useLocalStore((state) => state.username)
    const user = useHomeStore((state) => state.user)
    const setUser = useHomeStore((state) => state.setUser)
    const navigate = useNavigate()
    const partnerName = useChatProfileStore((state) => state.partnerName)
    const partnerBio = useChatProfileStore((state) => state.partnerBio)
    const commonGroups = useChatProfileStore((state) => state.commonGroups)
    const loadPartnerDetails = useChatProfileStore((state) => state.loadPartnerDetails)
    const loadCommonGroups = useChatProfileStore((state) => state.loadCommonGroups)
    const muteUnMuteChat = useChatProfileStore((state) => state.muteUnMuteChat)
    const [confirmOpen, setConfirmOpen] = useState(false)
    const [confirmTitle, setConfirmTitle] = useState('')
    const [confirmMessage, setConfirmMessage] = useState('')
    const [pendingAction, setPendingAction] = useState<'favourite' | 'clear' | 'delete' | null>(null)
    const [viewImageSrc, setViewImageSrc] = useState<string | null>(null)

    useEffect(() => {
        if (!currentChat || !username) return
        loadPartnerDetails(currentChat, username)
        loadCommonGroups(currentChat, username)
    }, [currentChat, username, loadPartnerDetails, loadCommonGroups])

    if (!currentChat || !username) return null

    const isMuted = currentChat.mutedBy.includes(username)

    const profileImage = ChatUtils.getUserChatProfileImage(currentChat, username)
    const profileUsername = ChatUtils.getUserChatUsername(currentChat, username)
    const profileInitial = profileUsername.charAt(0).toUpperCase()
    const isFavourite = user?.favourites?.includes(currentChat.chatId) ?? false

    const handleMuteToggle = (newValue: boolean) => {
        muteUnMuteChat(currentChat, username, newValue, (success) => {
            if (success) {
                enqueueSnackbar(newValue ? 'Chat muted' : 'Chat unmuted', { variant: 'success', autoHideDuration: 2000 })
            } else {
                enqueueSnackbar('Error updating mute status', { variant: 'error', autoHideDuration: 2000 })
            }
        })
    }

    const openConfirm = (type: 'favourite' | 'clear' | 'delete') => {
        setPendingAction(type)
        if (type === 'favourite') {
            setConfirmTitle(isFavourite ? 'Unfavourite' : 'Favourite')
            setConfirmMessage('Are you sure you want to update your favourites?')
        } else if (type === 'clear') {
            setConfirmTitle('Clear Chat')
            setConfirmMessage('Are you sure you want to clear this chat?')
        } else {
            setConfirmTitle('Delete Chat')
            setConfirmMessage('Are you sure you want to delete this chat?')
        }
        setConfirmOpen(true)
    }

    const handleConfirm = () => {
        setConfirmOpen(false)
        if (pendingAction === 'favourite') {
            if (!user) return
            markFavourite(user, currentChat.chatId, (done) => {
                if (!done) {
                    enqueueSnackbar(ErrorMessages.ERROR_UPDATING_FAVOURITE, { variant: 'error', autoHideDuration: 3000 })
                    return
                }
                const wasAlreadyFavourite = user.favourites.includes(currentChat.chatId)
                setUser(done)
                enqueueSnackbar(
                    wasAlreadyFavourite ? SuccessMessages.FAVOURITE_CLEARED_SUCCESSFULLY : SuccessMessages.FAVOURITE_MARKED_SUCCESSFULLY,
                    { variant: 'success', autoHideDuration: 3000 }
                )
            })
        } else if (pendingAction === 'clear') {
            clearChat(currentChat, (success) => {
                if (!success) { enqueueSnackbar(ErrorMessages.ERROR_CLEARING_CHAT, { variant: 'error', autoHideDuration: 3000 }); return }
                enqueueSnackbar(SuccessMessages.CHAT_CLEARED_SUCCESSFULLY, { variant: 'success', autoHideDuration: 3000 })
            })
        } else if (pendingAction === 'delete') {
            deleteChat(currentChat, (success) => {
                if (!success) { enqueueSnackbar(ErrorMessages.ERROR_DELETING_CHAT, { variant: 'error', autoHideDuration: 3000 }); return }
                enqueueSnackbar(SuccessMessages.CHAT_DELETED_SUCCESSFULLY, { variant: 'success', autoHideDuration: 3000 })
                setIsViewingProfile(false)
            })
        }
    }

    const handleGroupClick = (groupId: string) => {
        navigate('/group/' + groupId)
        setIsViewingProfile(false)
    }

    const mediaMessages = currentChat.chatMessages.filter(
        (msg) => msg.type === ChatMessageType.TypeImage && msg.image
    )

    return (
        <>
            <div className='flex flex-col h-full bg-[#1a2744] overflow-y-auto'>
                {/* Dark header — avatar, name, username, bio */}
                <div className='relative flex flex-col items-center pt-10 pb-6 px-4'>
                    <IconButton
                        onClick={() => setIsViewingProfile(false)}
                        sx={{ position: 'absolute', top: 8, right: 8, color: 'rgba(255,255,255,0.7)' }}>
                        <Close />
                    </IconButton>

                    <Avatar src={profileImage} sx={{ width: 88, height: 88, bgcolor: '#6366f1', fontSize: '2.2rem', mb: 1.5 }}>
                        {profileInitial}
                    </Avatar>

                    <Typography sx={{ color: 'white', fontWeight: 700, fontSize: '1.15rem', lineHeight: 1.2, textAlign: 'center' }}>
                        {partnerName || profileUsername}
                    </Typography>

                    {partnerName && partnerName !== profileUsername && (
                        <Typography sx={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.78rem', mt: 0.3 }}>
                            @{profileUsername}
                        </Typography>
                    )}

                    {partnerBio ? (
                        <Typography sx={{ color: 'rgba(255,255,255,0.72)', fontSize: '0.82rem', mt: 0.75, textAlign: 'center' }}>
                            {partnerBio}
                        </Typography>
                    ) : null}
                </div>

                {/* White card */}
                <div className='bg-white rounded-t-3xl flex-1 pb-2'>

                    {/* Medias */}
                    <div className='px-4 pt-4 pb-2'>
                        <Typography variant='subtitle1' sx={{ color: '#1a237e', fontWeight: 700, mb: 1 }}>
                            Medias
                        </Typography>
                        {mediaMessages.length === 0 ? (
                            <div className='flex justify-center items-center h-20 rounded-xl bg-gray-100'>
                                <Lottie className='max-h-16 max-w-16' animationData={emptyImageIconData} loop autoPlay />
                            </div>
                        ) : (
                            <div className='flex flex-wrap gap-2 max-h-36 overflow-y-auto'>
                                {mediaMessages.map((msg) => (
                                    <button
                                        key={msg.id}
                                        type='button'
                                        className='p-0 border-0 bg-transparent'
                                        onClick={() => setViewImageSrc(msg.image!)}>
                                        <img
                                            src={msg.image ?? undefined}
                                            alt='media'
                                            className='h-20 w-20 object-cover rounded-xl cursor-pointer hover:opacity-80 transition-opacity'
                                        />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    <Divider />

                    {/* Mute */}
                    <div className='flex items-center justify-between px-4 py-3'>
                        <div className='flex items-center gap-2'>
                            <Notifications sx={{ color: '#1a237e' }} />
                            <Typography variant='body1'>Mute Notifications</Typography>
                        </div>
                        <Switch checked={isMuted} onChange={(e) => handleMuteToggle(e.target.checked)} />
                    </div>

                    <Divider />

                    {/* Common Groups */}
                    <div className='px-4 py-3'>
                        <div className='flex items-center gap-1.5 mb-2'>
                            <Group sx={{ color: '#1a237e', fontSize: '1.15rem' }} />
                            <Typography variant='subtitle1' sx={{ color: '#1a237e', fontWeight: 700 }}>
                                Groups in Common
                            </Typography>
                        </div>
                        {commonGroups.length === 0 ? (
                            <Typography variant='body2' sx={{ color: 'text.secondary', pl: 0.5 }}>
                                No groups in common
                            </Typography>
                        ) : (
                            <div>
                                {commonGroups.map((group) => (
                                    <button
                                        key={group.id}
                                        type='button'
                                        className='flex items-center gap-3 py-2 px-1 rounded-xl w-full text-left cursor-pointer hover:bg-gray-100 active:bg-gray-200 transition-colors'
                                        onClick={() => handleGroupClick(group.id)}>
                                        <Avatar
                                            src={group.image ?? undefined}
                                            sx={{ width: 44, height: 44, bgcolor: '#3b82f6', fontSize: '1.05rem', flexShrink: 0 }}>
                                            {group.name.charAt(0).toUpperCase()}
                                        </Avatar>
                                        <div className='flex flex-col min-w-0'>
                                            <Typography variant='body2' sx={{ fontWeight: 700, lineHeight: 1.3, fontSize: '0.875rem' }}>
                                                {group.name}
                                            </Typography>
                                            <Typography
                                                variant='caption'
                                                sx={{ color: 'text.secondary', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', lineHeight: 1.4 }}>
                                                {group.members.map((m) => m.username).join(', ')}
                                            </Typography>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    <Divider />

                    {/* Favourite */}
                    <button
                        type='button'
                        className='flex items-center gap-3 px-4 py-3 w-full text-left cursor-pointer hover:bg-gray-50 transition-colors'
                        onClick={() => openConfirm('favourite')}>
                        {isFavourite ? (
                            <Favorite sx={{ color: '#e53935', fontSize: '1.3rem' }} />
                        ) : (
                            <FavoriteBorder sx={{ color: '#e53935', fontSize: '1.3rem' }} />
                        )}
                        <Typography variant='body1'>{isFavourite ? 'Unfavourite' : 'Favourite'}</Typography>
                    </button>

                    <Divider />

                    {/* Clear Chat */}
                    <button
                        type='button'
                        className='flex items-center gap-3 px-4 py-3 w-full text-left cursor-pointer hover:bg-gray-50 transition-colors'
                        onClick={() => openConfirm('clear')}>
                        <Clear sx={{ color: '#f97316', fontSize: '1.3rem' }} />
                        <Typography variant='body1'>Clear Chat</Typography>
                    </button>

                    <Divider />

                    {/* Delete Chat */}
                    <button
                        type='button'
                        className='flex items-center gap-3 px-4 py-3 w-full text-left cursor-pointer hover:bg-gray-50 transition-colors'
                        onClick={() => openConfirm('delete')}>
                        <DeleteOutlined sx={{ color: '#dc2626', fontSize: '1.3rem' }} />
                        <Typography variant='body1' sx={{ color: '#dc2626' }}>
                            Delete Chat
                        </Typography>
                    </button>
                </div>
            </div>

            <ConfirmDialog
                open={confirmOpen}
                handleClose={() => setConfirmOpen(false)}
                title={confirmTitle}
                message={confirmMessage}
                action={handleConfirm}
            />
            <ViewImageDialog
                open={!!viewImageSrc}
                setOpen={(val) => { if (!val) setViewImageSrc(null) }}
                image={viewImageSrc ?? ''}
                zoomIntensity={10}
                delay={0.2}
                initialZoomLevel={1}
                minZoomLevel={1}
                maxZoomLevel={2.5}
            />
        </>
    )
}

export default ViewProfile
