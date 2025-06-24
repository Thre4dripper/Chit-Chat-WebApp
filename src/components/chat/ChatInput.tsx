import React, { useState, useRef } from 'react'
import { IconButton, TextareaAutosize, Box, Popper, Paper, ClickAwayListener } from '@mui/material'
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions'
import ImageIcon from '@mui/icons-material/Image'
import SendIcon from '@mui/icons-material/Send'
import useChatDetailsStore from '../../store/chat.details.store.ts'
import useLocalStore from '../../store/local.store.ts'
import VirtualizedStickerGrid from '../listItems/ItemSticker.tsx'
import ImageCropFragment from '../../fragments/profile/ImageCropFragment.tsx'

const ChatInput: React.FC = () => {
    const [message, setMessage] = useState('')
    const sendMessage = useChatDetailsStore((state) => state.sendTextMessage)
    const chatDetails = useChatDetailsStore((state) => state.chatDetails)
    const username = useLocalStore((state) => state.username)
    const DrawerRef = useRef<HTMLButtonElement | null>(null)
    const [stickerOpen, setStickerOpen] = React.useState(false)
    const [imageOpen, setImageOpen] = React.useState(false)
    const [imagesrc, setImageSrc] = useState<string | null>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const toggleStickerDrawer = (newOpen: boolean) => {
        setStickerOpen(newOpen)
    }
    const toggleImageDrawer = (newOpen: boolean) => {
        setImageOpen(newOpen)
        setImageSrc(null)
    }
    const handleImageClick = () => {
        fileInputRef.current?.click()
        toggleImageDrawer(!imageOpen)
    }

    if (!chatDetails) return <></>

    const handleSendMessage = () => {
        if (message.trim() === '' || !username) return

        const from = username
        const to =
            chatDetails.dmChatUser1.username === username
                ? chatDetails.dmChatUser2.username
                : chatDetails.dmChatUser1.username

        sendMessage(chatDetails, message, from, to)
        setMessage('')
    }
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (file) {
            setImageSrc(URL.createObjectURL(file))
            setImageOpen(true)
        }
    }

    const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault()
            handleSendMessage()
        }
    }
    const PasteImage = (event: React.ClipboardEvent<HTMLTextAreaElement>) => {
        const items = event.clipboardData.items
        for (const item of items) {
            if (item.type.startsWith('image/')) {
                const file = item.getAsFile()
                const reader = new FileReader()
                console.log(3)
                reader.onload = (e) => {
                    const result = e.target?.result
                    if (typeof result === 'string') setImageSrc(result)
                    setImageOpen(true)
                }

                if (file) {
                    reader.readAsDataURL(file)
                }
                break
            }
        }
    }

    return (
        <div className='relative'>
            <Box className='bg-slate-300 rounded-bl-3xl rounded-br-3xl flex flex-row gap-2 items-center px-4 py-2 relative'>
                <input
                    type='file'
                    accept='image/*'
                    ref={fileInputRef}
                    style={{ display: 'none' }}
                    onChange={handleFileChange}
                />

                <IconButton onClick={handleImageClick}>
                    <ImageIcon className={`active:bg-slate-400 rounded-full text-gray-700`} />
                </IconButton>
                <IconButton ref={DrawerRef} onClick={() => toggleStickerDrawer(!stickerOpen)}>
                    <EmojiEmotionsIcon
                        className={`${
                            stickerOpen ? 'bg-slate-400 text-gray-400 rounded-full' : ''
                        } text-gray-700`}
                    />
                </IconButton>

                <Box className='flex flex-row flex-auto rounded-lg overflow-hidden'>
                    <TextareaAutosize
                        className='w-full p-3 text-white text-sm font-normal bg-slate-700 resize-none focus:outline-none rounded-lg
                        scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-slate-700 scrollbar-thumb-rounded-full scrollbar-track-rounded-full'
                        placeholder='Type a message...'
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyDown={handleKeyDown}
                        onPaste={PasteImage}
                        minRows={1}
                        maxRows={4}
                    />
                </Box>

                <IconButton onClick={handleSendMessage}>
                    <SendIcon className='text-gray-700' />
                </IconButton>
            </Box>
            {imagesrc && (
                <Popper
                    open={imageOpen}
                    anchorEl={DrawerRef.current}
                    placement='top-start'
                    disablePortal>
                    <ClickAwayListener
                        onClickAway={() => {
                            setImageOpen(false)
                            setImageSrc(null)
                        }}>
                        <Paper
                            elevation={3}
                            sx={{
                                zIndex: 10,
                                position: 'relative',
                                minWidth: 300,
                                maxWidth: 500,
                                // TODO height co fix rakha filhal dekho if sahi nahi lagta to isko remove karduga
                                maxHeight: 800,
                                p: 1,
                                margin: '30px',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                flexDirection: 'column',
                                overflow: 'hidden',
                                borderRadius: 2,
                            }}>
                            <ImageCropFragment
                                image={imagesrc}
                                cropShape='round'
                                aspect={1}
                                outputSize={{ width: 300, height: 300 }}
                                onCancel={() => {
                                    setImageOpen(false)
                                    setImageSrc(null)
                                }}
                                onConfirmed={() => {
                                    setImageOpen(false)
                                }}
                                Profile={false}
                            />
                            {/*<Box*/}
                            {/*    component="img"*/}
                            {/*    src={imagesrc}*/}
                            {/*    alt="preview"*/}
                            {/*    sx={{*/}
                            {/*        zIndex:20,*/}
                            {/*        width: '100%',*/}
                            {/*        height: '90%',*/}
                            {/*        objectFit: 'contain',*/}
                            {/*        borderRadius: 2,*/}
                            {/*        flexGrow: 1,*/}
                            {/*    }}*/}
                            {/*/>*/}
                        </Paper>
                    </ClickAwayListener>
                </Popper>
            )}
            <Popper
                open={stickerOpen}
                anchorEl={DrawerRef.current}
                placement='top-start'
                disablePortal>
                <ClickAwayListener onClickAway={() => setStickerOpen(false)}>
                    <Paper elevation={3} sx={{ zIndex: 10, margin: '30px' }}>
                        <VirtualizedStickerGrid closePopper={toggleStickerDrawer} />
                    </Paper>
                </ClickAwayListener>
            </Popper>
        </div>
    )
}

export default ChatInput
