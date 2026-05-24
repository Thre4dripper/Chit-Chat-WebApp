import { Avatar, IconButton, Typography, Switch, Divider, CircularProgress } from '@mui/material'
import { Close, Notifications, ExitToApp, PhotoCamera } from '@mui/icons-material'
import React, { useRef, useState } from 'react'
import ViewImageDialog from '../dialogs/ViewImageDialog.tsx'
import useChatDetailsStore from '../../store/chat.details.store.ts'
import useGroupChatStore from '../../store/group.chat.store.ts'
import useGroupProfileStore from '../../store/group.profile.store.ts'
import useLocalStore from '../../store/local.store.ts'
import { GroupMessageType } from '../../enums/GroupMessageType.ts'
import emptyImageIconData from '../../assets/lottie/no_photos.json'
import Lottie from 'lottie-react'
import { enqueueSnackbar } from 'notistack'
import ImageCropFragment from '../../fragments/profile/ImageCropFragment.tsx'
import StorageUtils from '../../utils/StorageUtils.ts'
import { useNavigate } from 'react-router'

// Mirrors GroupProfileActivity + GroupProfileViewModel in Android

const GroupProfileFragment: React.FC = () => {
    const groupChat = useGroupChatStore((state) => state.groupChatDetails)
    const exitGroup = useGroupChatStore((state) => state.exitGroup)
    const muteUnMuteGroup = useGroupProfileStore((state) => state.muteUnMuteGroup)
    const findGroupMember = useGroupProfileStore((state) => state.findGroupMember)
    const updateGroupImage = useGroupProfileStore((state) => state.updateGroupImage)
    const setIsViewingGroupProfile = useChatDetailsStore((state) => state.setIsViewingGroupProfile)
    const username = useLocalStore((state) => state.username)
    const navigate = useNavigate()
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [groupBrowsedImage, setGroupBrowsedImage] = useState<string | null>(null)
    const [isUploading, setIsUploading] = useState(false)
    const [viewImageSrc, setViewImageSrc] = useState<string | null>(null)

    if (!groupChat || !username) return null

    const isMuted = groupChat.mutedBy.includes(username)

    const groupInitial = groupChat.name.charAt(0).toUpperCase()

    const handleMuteToggle = (newValue: boolean) => {
        muteUnMuteGroup(groupChat, username, newValue, (success) => {
            if (success) {
                enqueueSnackbar(newValue ? 'Group muted' : 'Group unmuted', {
                    variant: 'success',
                    autoHideDuration: 2000,
                })
            } else {
                enqueueSnackbar('Error updating mute status', {
                    variant: 'error',
                    autoHideDuration: 2000,
                })
            }
        })
    }

    const handleExitGroup = () => {
        exitGroup()
        setIsViewingGroupProfile(false)
        enqueueSnackbar('Exited group', { variant: 'success', autoHideDuration: 2000 })
    }

    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return
        e.target.value = ''
        const base64 = await StorageUtils.fileToBase64(file)
        if (base64) setGroupBrowsedImage(base64)
    }

    const handleMemberClick = (memberUsername: string) => {
        if (memberUsername === username) return
        findGroupMember(memberUsername, (chatId) => {
            if (!chatId) {
                enqueueSnackbar('Could not find user', { variant: 'error', autoHideDuration: 2000 })
                return
            }
            navigate('/chat/' + chatId)
            setIsViewingGroupProfile(false)
        })
    }

    const mediaMessages = groupChat.messages.filter(
        (msg) => msg.type === GroupMessageType.TypeImage && msg.image
    )

    return (
        <div className='flex flex-col h-full bg-[#1a2744] overflow-y-auto'>
            {/* Crop overlay — shown on top when an image is selected */}
            {groupBrowsedImage && (
                <div className='absolute inset-0 z-50 bg-white overflow-y-auto'>
                    <ImageCropFragment
                        image={groupBrowsedImage}
                        cropShape='round'
                        aspect={1}
                        outputSize={{ width: 400, height: 400 }}
                        onCancel={() => setGroupBrowsedImage(null)}
                        onConfirmed={(file) => {
                            setGroupBrowsedImage(null)
                            setIsUploading(true)
                            updateGroupImage(groupChat.id, file, (success) => {
                                setIsUploading(false)
                                enqueueSnackbar(
                                    success ? 'Group image updated' : 'Error updating group image',
                                    {
                                        variant: success ? 'success' : 'error',
                                        autoHideDuration: 2500,
                                    }
                                )
                            })
                        }}
                    />
                </div>
            )}
            {/* Dark header */}
            <div className='relative flex flex-col items-center pt-10 pb-6 px-4'>
                <IconButton
                    onClick={() => setIsViewingGroupProfile(false)}
                    sx={{ position: 'absolute', top: 8, right: 8, color: 'rgba(255,255,255,0.7)' }}>
                    <Close />
                </IconButton>

                <div className='relative mb-1.5'>
                    <Avatar
                        src={groupChat.image ?? undefined}
                        sx={{ width: 88, height: 88, bgcolor: '#3b82f6', fontSize: '2.2rem' }}>
                        {groupInitial}
                    </Avatar>
                    {isUploading && (
                        <div className='absolute inset-0 flex items-center justify-center bg-black/40 rounded-full'>
                            <CircularProgress size={32} sx={{ color: 'white' }} />
                        </div>
                    )}
                    <IconButton
                        onClick={() => fileInputRef.current?.click()}
                        sx={{
                            'position': 'absolute',
                            'bottom': 0,
                            'right': -4,
                            'bgcolor': 'rgba(255,255,255,0.9)',
                            '&:hover': { bgcolor: 'white' },
                            'width': 28,
                            'height': 28,
                            'boxShadow': 1,
                        }}>
                        <PhotoCamera sx={{ fontSize: '1rem', color: '#1a2744' }} />
                    </IconButton>
                    <input
                        ref={fileInputRef}
                        type='file'
                        accept='image/*'
                        hidden
                        onChange={handleImageChange}
                    />
                </div>

                <Typography
                    sx={{
                        color: 'white',
                        fontWeight: 700,
                        fontSize: '1.15rem',
                        textAlign: 'center',
                    }}>
                    {groupChat.name}
                </Typography>
                <Typography sx={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.82rem', mt: 0.3 }}>
                    {groupChat.members.length} members
                </Typography>
            </div>

            {/* White card */}
            <div className='bg-white rounded-t-3xl flex-1 pb-2'>
                {/* Medias */}
                <div className='px-4 pt-4 pb-2'>
                    <Typography
                        variant='subtitle1'
                        sx={{ color: '#1a237e', fontWeight: 700, mb: 1 }}>
                        Medias
                    </Typography>
                    {mediaMessages.length === 0 ? (
                        <div className='flex justify-center items-center h-20 rounded-xl bg-gray-100'>
                            <Lottie
                                className='max-h-16 max-w-16'
                                animationData={emptyImageIconData}
                                loop
                                autoPlay
                            />
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
                    <Switch
                        checked={isMuted}
                        onChange={(e) => handleMuteToggle(e.target.checked)}
                    />
                </div>

                <Divider />

                {/* Members */}
                <div className='px-4 py-3'>
                    <Typography
                        variant='subtitle1'
                        sx={{ color: '#1a237e', fontWeight: 700, mb: 1 }}>
                        Members ({groupChat.members.length})
                    </Typography>
                    <div className='space-y-1 max-h-52 overflow-y-auto'>
                        {groupChat.members.map((member) => (
                            <button
                                type='button'
                                key={member.username}
                                className={`flex items-center gap-3 py-2 px-1 rounded-xl w-full text-left transition-colors ${member.username !== username ? 'cursor-pointer hover:bg-gray-100 active:bg-gray-200' : 'cursor-default'}`}
                                onClick={() => handleMemberClick(member.username)}>
                                <Avatar
                                    src={member.profileImage || undefined}
                                    sx={{
                                        width: 40,
                                        height: 40,
                                        bgcolor: '#6366f1',
                                        fontSize: '0.95rem',
                                        flexShrink: 0,
                                    }}>
                                    {member.username.charAt(0).toUpperCase()}
                                </Avatar>
                                <Typography variant='body2' sx={{ fontWeight: 600 }}>
                                    {member.username === username
                                        ? `${member.username} (You)`
                                        : member.username}
                                </Typography>
                            </button>
                        ))}
                    </div>
                </div>

                <Divider />

                {/* Exit Group */}
                <button
                    type='button'
                    className='flex items-center gap-3 px-4 py-3 w-full text-left cursor-pointer hover:bg-gray-50 transition-colors'
                    onClick={handleExitGroup}>
                    <ExitToApp sx={{ color: '#dc2626', fontSize: '1.3rem' }} />
                    <Typography variant='body1' sx={{ color: '#dc2626', fontWeight: 600 }}>
                        Exit Group
                    </Typography>
                </button>
            </div>
            <ViewImageDialog
                open={!!viewImageSrc}
                setOpen={(val) => {
                    if (!val) setViewImageSrc(null)
                }}
                image={viewImageSrc ?? ''}
                zoomIntensity={10}
                delay={0.2}
                initialZoomLevel={1}
                minZoomLevel={1}
                maxZoomLevel={2.5}
            />
        </div>
    )
}

export default GroupProfileFragment
