import React, { useState, useRef } from 'react';
import {
    IconButton,
    TextareaAutosize,
    Box,
    Popper,
    Paper,
    ClickAwayListener,
    Modal,
} from '@mui/material';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import ImageIcon from '@mui/icons-material/Image';
import SendIcon from '@mui/icons-material/Send';
import CloseIcon from '@mui/icons-material/Close';
import useChatDetailsStore from '../../store/chat.details.store.ts';
import useLocalStore from '../../store/local.store.ts';
import VirtualizedStickerGrid from '../listItems/ItemSticker.tsx';
import ImageSendFragment from '../../fragments/home/ImageSendFragement.tsx';

const ChatInput: React.FC = () => {
    const [message, setMessage] = useState('');
    const [stickerOpen, setStickerOpen] = useState(false);
    const [imageOpen, setImageOpen] = useState(false);
    const [imagesrc, setImageSrc] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const DrawerRef = useRef<HTMLButtonElement | null>(null);

    const sendMessage = useChatDetailsStore((state) => state.sendTextMessage);
    const chatDetails = useChatDetailsStore((state) => state.chatDetails);
    const username = useLocalStore((state) => state.username);

    const handleSendMessage = () => {
        if (!message.trim() || !username || !chatDetails) return;

        const to =
            chatDetails.dmChatUser1.username === username
                ? chatDetails.dmChatUser2.username
                : chatDetails.dmChatUser1.username;

        sendMessage(chatDetails, message, username, to);
        setMessage('');
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageSrc(URL.createObjectURL(file));
            setImageOpen(true);
            e.target.value = '';
        }

    };

    const handlePaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
        const items = e.clipboardData.items;
        for (const item of items) {
            if (item.type.startsWith('image/')) {
                const file = item.getAsFile();
                const reader = new FileReader();
                reader.onload = (ev) => {
                    const result = ev.target?.result;
                    if (typeof result === 'string') setImageSrc(result);
                    setImageOpen(true);
                };
                if (file) reader.readAsDataURL(file);
            }
        }
    };

    const toggleStickerDrawer = () => setStickerOpen(!stickerOpen);

    if (!chatDetails) return null;

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
                                e.preventDefault();
                                handleSendMessage();
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
                        <VirtualizedStickerGrid closePopper={setStickerOpen} />
                    </Paper>
                </ClickAwayListener>
            </Popper>

            <Modal open={imageOpen} onClose={() => setImageOpen(false)}>
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 600,
                        backgroundColor: 'background.paper',
                        p: 6,
                    }}
                >
                    <ImageSendFragment
                        image={imagesrc}
                        cropShape="rect"
                        onConfirmed={() => {
                            setImageOpen(false);
                            setImageSrc(null);
                        }}
                    />
                    <IconButton
                        color="error"
                        onClick={() => {
                            setImageOpen(false);
                            setImageSrc(null);
                        }}
                        sx={{ position: 'absolute', top: 1, right: 2 }}
                    >
                        <CloseIcon />
                    </IconButton>
                </Box>
            </Modal>
        </div>
    );
};

export default ChatInput;
