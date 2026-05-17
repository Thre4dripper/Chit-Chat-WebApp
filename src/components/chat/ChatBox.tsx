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
import { Fab } from '@mui/material'
import KeyboardDoubleArrowDownIcon from '@mui/icons-material/KeyboardDoubleArrowDown'
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

    const handleDragging = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        setDragging(true)
    }
    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        const file = e.dataTransfer.files[0]
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader()
            reader.onload = () => {
                setImageSrc(reader.result as string)
                setImageOpen(true)
            }
            reader.readAsDataURL(file)
        } else {
            setDragging(false)
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
                currentChat.chatMessages.map((message, index) => (
                    <div
                        className={'flex gap-2'}
                        key={message.id}
                        ref={index === 0 ? observerTarget : null}>
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
                    </div>
                ))}
            {dragging && (
                <div className='absolute top-0 left-0 w-full h-full flex items-center justify-center bg-[#075e54]/90 z-50'>
                    <div className='flex flex-col items-center'>
                        <div className='rounded-full bg-white p-4 mb-4 shadow-lg'>
                            <svg width='48' height='48' fill='#25d366' viewBox='0 0 24 24'>
                                <path d='M19.35 10.04A7.49 7.49 0 0 0 12 4a7.5 7.5 0 0 0-6.36 11.04L4 20l4.96-1.64A7.5 7.5 0 0 0 12 20c4.14 0 7.5-3.36 7.5-7.5 0-1.61-.51-3.1-1.38-4.32zm-7.35 8c-1.23 0-2.42-.36-3.43-1.03l-.25-.16-2.94.97.98-2.87-.16-.26A6.48 6.48 0 1 1 18.5 12c0 3.58-2.92 6.5-6.5 6.5zm3.54-4.29c-.19-.1-1.12-.55-1.29-.61-.17-.06-.29-.1-.41.1-.12.19-.47.61-.58.73-.1.12-.21.13-.4.04-.19-.1-.8-.29-1.52-.92-.56-.5-.94-1.12-1.05-1.31-.11-.19-.01-.29.08-.38.09-.09.19-.21.29-.32.1-.11.13-.19.2-.31.07-.12.03-.23-.01-.32-.04-.09-.41-.99-.56-1.36-.15-.36-.3-.31-.41-.32-.11-.01-.23-.01-.36-.01-.12 0-.32.05-.49.23-.17.18-.65.64-.65 1.56 0 .92.67 1.81.76 1.93.09.12 1.32 2.02 3.2 2.75.45.16.8.25 1.07.32.45.11.86.09 1.18.05.36-.05 1.12-.46 1.28-.9.16-.44.16-.82.11-.9-.05-.08-.17-.12-.36-.21z' />
                            </svg>
                        </div>
                        <div className='text-white text-xl font-medium drop-shadow-lg'>
                            Drop your image here
                        </div>
                    </div>
                </div>
            )}
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
