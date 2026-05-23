import React, { SetStateAction, useEffect, useRef, useState } from 'react'
import { ChatMessageType } from '../../enums/ChatMessageType.ts'
import useChatDetailsStore from '../../store/chat.details.store.ts'
import useLocalStore from '../../store/local.store.ts'
import ItemChatTextLeft from '../listItems/ItemChatTextLeft.tsx'
import ItemChatImageLeft from '../listItems/ItemChatImageLeft.tsx'
import ItemChatStickerLeft from '../listItems/ItemChatStickerLeft.tsx'
import ItemChatTextRight from '../listItems/ItemChatTextRight.tsx'
import ItemChatImageRight from '../listItems/ItemChatImageRight.tsx'
import ItemChatStickerRight from '../listItems/ItemChatStickerRight.tsx'
import EmptyChatFragment from '../../fragments/home/EmptyChatFragment.tsx'
import ItemChatHelloMessage from '../listItems/ItemChatHelloMessage.tsx'
import ChatMessageModel from '../../models/chat.message.model.ts'
import { Fab, Popover, Avatar, IconButton } from '@mui/material'
import KeyboardDoubleArrowDownIcon from '@mui/icons-material/KeyboardDoubleArrowDown'
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate'
import CloseIcon from '@mui/icons-material/Close'
import { enqueueSnackbar } from 'notistack'

interface ChatBoxProps {
    setImageSrc: React.Dispatch<SetStateAction<string | null>>
    setImageOpen: React.Dispatch<SetStateAction<boolean>>
}

const ChatBox: React.FC<ChatBoxProps> = ({ setImageSrc, setImageOpen }) => {
    const currentChat = useChatDetailsStore((state) => state.chatDetails)
    const username = useLocalStore((state) => state.username)

    const [showGotoBottomButton, setShowGotoBottomButton] = useState(false)
    const observerTarget = useRef(null)

    const [dragging, setDragging] = useState<boolean>(false)
    const [seenByAnchor, setSeenByAnchor] = useState<HTMLElement | null>(null)
    const [seenByDMUsers, setSeenByDMUsers] = useState<{ username: string; profileImage: string }[]>([])

    const handleDragging = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        setDragging(true)
    }
    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        setDragging(false)
        const file = e.dataTransfer.files[0]
        if (file && file.type.startsWith('image/')) {
            setImageSrc(URL.createObjectURL(file))
            setImageOpen(true)
        } else {
            enqueueSnackbar('Only Images allowed ', { variant: 'error', autoHideDuration: 3000 })
        }
    }

    useEffect(() => {
        // Create an IntersectionObserver to observe the last chat message
        const observer = new IntersectionObserver(
            (entries) => {
                const entry = entries[0]
                if (entry.isIntersecting) {
                    setShowGotoBottomButton(false)
                } else {
                    setShowGotoBottomButton(true)
                }
            },
            { threshold: 0.1 }
        )

        const target = observerTarget.current

        if (target) {
            observer.observe(target)
        }

        return () => {
            if (target) {
                observer.unobserve(target)
            }
        }

        // reset the observer when the chat messages change
    }, [currentChat?.chatMessages])

    const scrollToBottom = () => {
        if (observerTarget.current) {
            const target = observerTarget.current as HTMLDivElement
            target.scrollIntoView({ behavior: 'smooth' })
        }
    }

    if (currentChat === null) {
        return <EmptyChatFragment />
    }

    const getSeenBy = (message: ChatMessageModel) => {
        // return profile image of users who have seen the message except the sender
        return message.seenBy
            .filter((item) => item !== username)
            .map((item) =>
                currentChat.dmChatUser1.username === item
                    ? currentChat.dmChatUser1.profileImage
                    : currentChat.dmChatUser2.profileImage
            )
    }

    const getSeenByDMUsers = (message: ChatMessageModel) => {
        return message.seenBy
            .filter((item) => item !== message.from)
            .map((item) => ({
                username: item,
                profileImage:
                    currentChat.dmChatUser1.username === item
                        ? currentChat.dmChatUser1.profileImage
                        : currentChat.dmChatUser2.profileImage,
            }))
    }

    const dmContentTypes = [ChatMessageType.TypeText, ChatMessageType.TypeImage, ChatMessageType.TypeSticker]
    const TextMessage = ({ message }: { message: ChatMessageModel }) => {
        if (message.from !== username) {
            return (
                <ItemChatTextLeft
                    profileImage={
                        currentChat.dmChatUser2.username === username
                            ? currentChat.dmChatUser1.profileImage
                            : currentChat.dmChatUser2.profileImage
                    }
                    message={message.text as string}
                    time={message.time}
                />
            )
        } else {
            return (
                <ItemChatTextRight
                    seen={getSeenBy(message)}
                    message={message.text as string}
                    time={message.time}
                    onSeenByClick={(anchor) => {
                        setSeenByAnchor(anchor)
                        setSeenByDMUsers(getSeenByDMUsers(message))
                    }}
                />
            )
        }
    }

    const ImageMessage = ({ message }: { message: ChatMessageModel }) => {
        if (message.image === null || message.image === undefined) {
            return null
        }
        if (message.from !== username) {
            return (
                <ItemChatImageLeft
                    profileImage={
                        currentChat.dmChatUser2.username === username
                            ? currentChat.dmChatUser1.profileImage
                            : currentChat.dmChatUser2.profileImage
                    }
                    image={message.image}
                    time={message.time}
                />
            )
        } else {
            return (
                <ItemChatImageRight
                    seen={getSeenBy(message)}
                    image={message.image}
                    time={message.time}
                    onSeenByClick={(anchor) => {
                        setSeenByAnchor(anchor)
                        setSeenByDMUsers(getSeenByDMUsers(message))
                    }}
                />
            )
        }
    }

    const StickerMessage = ({ message }: { message: ChatMessageModel }) => {
        if (message.sticker === null || message.sticker === undefined) {
            return null
        }
        if (message.from !== username) {
            return (
                <ItemChatStickerLeft
                    profileImage={
                        currentChat.dmChatUser2.username === username
                            ? currentChat.dmChatUser1.profileImage
                            : currentChat.dmChatUser2.profileImage
                    }
                    sticker={message.sticker}
                    time={message.time}
                />
            )
        } else {
            return (
                <ItemChatStickerRight
                    seen={getSeenBy(message)}
                    sticker={message.sticker}
                    time={message.time}
                    onSeenByClick={(anchor) => {
                        setSeenByAnchor(anchor)
                        setSeenByDMUsers(getSeenByDMUsers(message))
                    }}
                />
            )
        }
    }

    return (
        <div
            onDragOver={handleDragging}
            onDrop={handleDrop}
            onDragLeave={() => setDragging(false)}
            className={
                `z-0 flex-1 ${dragging ? 'bg-slate-400 border-4 border-dotted border-blue-400 ' : 'bg-white'} overflow-y-scroll flex flex-col-reverse relative ` +
                'scrollbar-thin scrollbar-thumb-slate-500/50 scrollbar-track-white scrollbar-thumb-rounded-full h-full'
            }>
            {!dragging &&
                currentChat.chatMessages.map((message, index) => {
                    const isOwnContent = message.from === username && dmContentTypes.includes(message.type)
                    return (
                    <div
                        className={'flex gap-2' + (isOwnContent ? ' cursor-context-menu' : '')}
                        key={message.id}
                        ref={index === 0 ? observerTarget : null}
                        onContextMenu={isOwnContent ? (e) => {
                            e.preventDefault()
                            setSeenByAnchor(e.currentTarget)
                            setSeenByDMUsers(getSeenByDMUsers(message))
                        } : undefined}>
                        {/*First Message*/}
                        {message.type === ChatMessageType.TypeFirstMessage && (
                            <ItemChatHelloMessage />
                        )}
                        {/*text Message*/}
                        {message.type === ChatMessageType.TypeText && (
                            <TextMessage message={message} />
                        )}
                        {/*Image Message*/}
                        {message.type === ChatMessageType.TypeImage && (
                            <ImageMessage message={message} />
                        )}
                        {/*Sticker Message*/}
                        {message.type === ChatMessageType.TypeSticker && (
                            <StickerMessage message={message} />
                        )}
                            {/*Deleted Message*/}
                            {message.type === ChatMessageType.TypeDeletedMessage && (
                                <div className='w-full flex justify-center py-2'>
                                    <span className='text-sm text-gray-400 italic'>This message was deleted</span>
                                </div>
                            )}
                    </div>
                    )
                })
            }
            {dragging && (
                <div className='absolute top-0 left-0 w-full h-full flex items-center justify-center bg-[#075e54]/90 z-50'>
                    <div className='flex flex-col items-center'>
                        <div className='rounded-full bg-white p-4 mb-4 shadow-lg'>
                            <AddPhotoAlternateIcon
                                sx={{ width: 48, height: 48, color: '#25d366' }}
                            />
                        </div>
                        <div className='text-white text-xl font-medium drop-shadow-lg'>
                            Drop your image here
                        </div>
                    </div>
                </div>
            )}
            <Popover
                open={Boolean(seenByAnchor)}
                anchorEl={seenByAnchor}
                onClose={() => setSeenByAnchor(null)}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                transformOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                slotProps={{ paper: { sx: { borderRadius: 3 } } }}>
                <div className='p-3 min-w-45'>
                    <div className='flex items-center justify-between mb-2'>
                        <span className='text-sm font-semibold text-gray-700'>Seen By</span>
                        <IconButton size='small' onClick={() => setSeenByAnchor(null)}>
                            <CloseIcon fontSize='small' />
                        </IconButton>
                    </div>
                    {seenByDMUsers.length === 0 ? (
                        <p className='text-sm text-gray-400 px-1 pb-1'>No one has seen this</p>
                    ) : (
                        seenByDMUsers.map((u) => (
                            <div key={u.username} className='flex items-center gap-2 py-1 px-1'>
                                <Avatar src={u.profileImage} alt={u.username} slotProps={{ img: { referrerPolicy: 'no-referrer' } }} sx={{ width: 28, height: 28 }} />
                                <span className='text-sm text-gray-700'>{u.username}</span>
                            </div>
                        ))
                    )}
                </div>
            </Popover>
            <Fab
                sx={{
                    'position': 'fixed',
                    'backgroundColor': '#334155',
                    'bottom': 80,
                    'right': 20,
                    'zIndex': 100,
                    'color': 'white',
                    '&:hover': {
                        backgroundColor: '#475569',
                    },
                    'width': 50,
                    'height': 50,
                    'display': showGotoBottomButton ? 'flex' : 'none',
                }}
                onClick={scrollToBottom}>
                <KeyboardDoubleArrowDownIcon />
            </Fab>
        </div>
    )
}

export default ChatBox
