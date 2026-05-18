import React, { useState, useRef } from 'react'
import {
    IconButton,
    TextareaAutosize,
    Box,
    Popper,
    Paper,
    ClickAwayListener
} from '@mui/material'
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions'
import ImageIcon from '@mui/icons-material/Image'
import SendIcon from '@mui/icons-material/Send'
import useLocalStore from '../../store/local.store.ts'
import VirtualizedStickerGrid from '../listItems/ItemSticker.tsx'
import useChatDetailsStore from '../../store/chat.details.store.ts'

interface ChatInputProps {
    handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void
    handlePaste: (e: React.ClipboardEvent<HTMLTextAreaElement>) => void
    fileInputRef: React.RefObject<HTMLInputElement>
}


const GroupChatInput: React.FC<ChatInputProps> = ({ handlePaste, fileInputRef, handleFileChange }) => {
    const [message, setMessage] = useState('')
    const [stickerOpen, setStickerOpen] = useState(false)

    const DrawerRef = useRef<HTMLButtonElement | null>(null)
    const groupChatMessage = useChatDetailsStore((state) => state.groupChatDetails)
    const sendGroupTextMessage = useChatDetailsStore((state) => state.sendGroupTextMessage)
    const sendGroupStickerMessage = useChatDetailsStore((state) => state.sendGroupStickerMessage)
    const username = useLocalStore((state) => state.username)

    const handleSendMessage = () => {
        if (!message.trim() || !username || !groupChatMessage) return
        sendGroupTextMessage(groupChatMessage, message, username)
        setMessage('')
    }

    const handleSendSticker = (stickerIndex: number) => {
        if (!username || !groupChatMessage) return
        sendGroupStickerMessage(groupChatMessage, stickerIndex, username)
    }

    const toggleStickerDrawer = () => setStickerOpen(!stickerOpen)

    if (!groupChatMessage) return null

    return (
        <div className="relative w-full">
            <Box className="bg-slate-300 rounded-bl-3xl rounded-br-3xl flex items-center px-4 py-2 gap-2">
                <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    style={{ display: 'none' }}
                    onChange={handleFileChange}
                />

                <IconButton onClick={() => fileInputRef.current?.click()}>
                    <ImageIcon className="text-gray-700" />
                </IconButton>
                <IconButton ref={DrawerRef} onClick={toggleStickerDrawer}>
                    <EmojiEmotionsIcon
                        className={`text-gray-700 ${
                            stickerOpen ? 'bg-gray-400 rounded-full' : ''
                        }`}
                    />
                </IconButton>

                <Box className="flex flex-1">
                    <TextareaAutosize
                        className="w-full p-3 text-white bg-slate-700 rounded-lg resize-none focus:outline-none scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-slate-700 scrollbar-thumb-rounded-full"
                        placeholder="Type a message..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault()
                                handleSendMessage()
                            }
                        }}
                        onPaste={handlePaste}
                        minRows={1}
                        maxRows={4}
                    />
                </Box>

                <IconButton onClick={handleSendMessage}>
                    <SendIcon className="text-gray-700" />
                </IconButton>
            </Box>

            <Popper open={stickerOpen} anchorEl={DrawerRef.current} placement="top-start">
                <ClickAwayListener onClickAway={() => setStickerOpen(false)}>
                    <Paper elevation={3} sx={{ zIndex: 10, margin: '20px' }}>
                        <VirtualizedStickerGrid
                            closePopper={setStickerOpen}
                            onStickerSelect={handleSendSticker}
                        />
                    </Paper>
                </ClickAwayListener>
            </Popper>

        </div>
    )
}

export default GroupChatInput
