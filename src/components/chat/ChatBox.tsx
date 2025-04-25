import React, { useEffect, useRef, useState } from 'react'
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

const ChatBox: React.FC = () => {
    const currentChat = useChatDetailsStore((state) => state.chatDetails)
    const username = useLocalStore((state) => state.username)

    const [showGotoBottomButton, setShowGotoBottomButton] = useState(false)
    const observerTarget = useRef(null)

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
            className={
                'z-0 flex-1 bg-white overflow-y-scroll flex flex-col-reverse relative ' +
                'scrollbar-thin scrollbar-thumb-slate-500/50 scrollbar-track-white scrollbar-thumb-rounded-full h-full'
            }>
            {currentChat.chatMessages.map((message, index) => (
                <div
                    className={'flex gap-2'}
                    key={message.id}
                    ref={index === 0 ? observerTarget : null}>
                    {/*First Message*/}
                    {message.type === ChatMessageType.TypeFirstMessage && <ItemChatHelloMessage />}
                    {/*text Message*/}
                    {message.type === ChatMessageType.TypeText && <TextMessage message={message} />}
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