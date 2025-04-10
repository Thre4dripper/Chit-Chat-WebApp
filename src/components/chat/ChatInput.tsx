import React, { useState ,useRef} from 'react'
import { IconButton, TextareaAutosize, Box,  Popper, Paper, ClickAwayListener } from '@mui/material'
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import ImageIcon from '@mui/icons-material/Image';
import SendIcon from '@mui/icons-material/Send'
import useChatDetailsStore from '../../store/chat.details.store.ts'
import useLocalStore from '../../store/local.store.ts'
import VirtualizedStickerGrid from '../listItems/ItemSticker.tsx'


const ChatInput: React.FC = () => {
    const [message, setMessage] = useState('')
    const sendMessage = useChatDetailsStore((state) => state.sendTextMessage)
    const chatDetails = useChatDetailsStore((state) => state.chatDetails)
    const username = useLocalStore((state) => state.username)
    const DrawerRef = useRef<HTMLButtonElement | null>(null);
    const [stickerOpen, setStickerOpen] = React.useState(false)
    const [imageOpen,setImageOpen]=React.useState(false)

    const toggleStickerDrawer = (newOpen: boolean) => {
        setStickerOpen(newOpen)
    }
    const toggleImageDrawer=(newOpen:boolean)=>{
        setImageOpen(newOpen)
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

    const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault()
            handleSendMessage()
        }
    }


    return (
        <div className="relative">
            <Box
                className="bg-slate-300 rounded-bl-3xl rounded-br-3xl flex flex-row gap-2 items-center px-4 py-2 relative"
            >
                <IconButton onClick={()=>toggleImageDrawer(!imageOpen)}>
                    <ImageIcon
                        className={`${
                            imageOpen ? 'bg-slate-400 text-gray-400 rounded-full' : ''
                        } text-gray-700`}
                    />
                </IconButton>
                <IconButton ref={DrawerRef} onClick={()=>toggleStickerDrawer(!stickerOpen)}>
                    <EmojiEmotionsIcon
                        className={`${
                            stickerOpen ? 'bg-slate-400 text-gray-400 rounded-full' : ''
                        } text-gray-700`}
                    />
                </IconButton>


                <Box className="flex flex-row flex-auto rounded-lg overflow-hidden">
                    <TextareaAutosize
                        className="w-full p-3 text-white text-sm font-normal bg-slate-700 resize-none focus:outline-none rounded-lg
                        scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-slate-700 scrollbar-thumb-rounded-full scrollbar-track-rounded-full"
                        placeholder="Type a message..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyDown={handleKeyDown}
                        minRows={1}
                        maxRows={4}
                    />
                </Box>

                <IconButton onClick={handleSendMessage}>
                    <SendIcon className="text-gray-700" />
                </IconButton>


            </Box>
            <Popper open={stickerOpen} anchorEl={DrawerRef.current} placement="top-start" disablePortal>
                <ClickAwayListener onClickAway={() => setStickerOpen(false)}>
                    <Paper elevation={3} sx={{zIndex: 10,margin:'30px'}}>
                        <VirtualizedStickerGrid closePopper={toggleStickerDrawer}/>
                    </Paper>
                </ClickAwayListener>
            </Popper>
        </div>

            )
            }

            export default ChatInput
