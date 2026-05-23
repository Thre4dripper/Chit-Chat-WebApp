import React, { SetStateAction, useEffect, useRef, useState } from 'react'
import useGroupChatStore from '../../store/group.chat.store.ts'
import useGroupProfileStore from '../../store/group.profile.store.ts'
import useChatDetailsStore from '../../store/chat.details.store.ts'
import useLocalStore from '../../store/local.store.ts'
import { ChatType } from '../../enums/ChatType.ts'
import ItemChatTextLeft from '../listItems/ItemChatTextLeft.tsx'
import ItemChatImageLeft from '../listItems/ItemChatImageLeft.tsx'
import ItemChatStickerLeft from '../listItems/ItemChatStickerLeft.tsx'
import ItemChatTextRight from '../listItems/ItemChatTextRight.tsx'
import ItemChatImageRight from '../listItems/ItemChatImageRight.tsx'
import ItemChatStickerRight from '../listItems/ItemChatStickerRight.tsx'
import EmptyChatFragment from '../../fragments/home/EmptyChatFragment.tsx'
import ItemChatHelloMessage from '../listItems/ItemChatHelloMessage.tsx'
import { Fab } from '@mui/material'
import KeyboardDoubleArrowDownIcon from '@mui/icons-material/KeyboardDoubleArrowDown'
import { enqueueSnackbar } from 'notistack'
import GroupMessageModel from '../../models/group.message.model.ts'
import { GroupMessageType } from '../../enums/GroupMessageType.ts'

interface GroupChatBoxProps {
    setImageSrc: React.Dispatch<SetStateAction<string | null>>
    setImageOpen: React.Dispatch<SetStateAction<boolean>>
}

const GroupChatBox: React.FC<GroupChatBoxProps> = ({ setImageSrc, setImageOpen }) => {
    const currentGroupChat = useGroupChatStore((state) => state.groupChatDetails)
    const username = useLocalStore((state) => state.username)
    const findGroupMember = useGroupProfileStore((state) => state.findGroupMember)
    const setCurrentChatId = useChatDetailsStore((state) => state.setCurrentChatId)

    const [showGotoBottomButton, setShowGotoBottomButton] = useState(false)
    const observerTarget = useRef(null)

    const [dragging, setDragging] = useState<boolean>(false)

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
    }, [currentGroupChat])

    const scrollToBottom = () => {
        if (observerTarget.current) {
            const target = observerTarget.current as HTMLDivElement
            target.scrollIntoView({ behavior: 'smooth' })
        }
    }

    if (currentGroupChat === null) {
        return <EmptyChatFragment />
    }

    const sendBy = (message: GroupMessageModel) => {
        const sender = currentGroupChat.members.find((member) => member.username === message.from)
        return sender?.profileImage
    }

    const handleAvatarClick = (memberUsername: string) => {
        findGroupMember(memberUsername, (chatId) => {
            if (!chatId) return
            setCurrentChatId(chatId, ChatType.USER)
        })
    }

    const getSeenBy = (message: GroupMessageModel) => {
        // return profile image of users who have seen the message except the sender
        return message.seenBy
            .filter((item) => item !== username)
            .map((item) => {
                const member = currentGroupChat.members.find((member) => member.username === item)
                return member?.profileImage
            })
    }
    const TextMessage = ({ message }: { message: GroupMessageModel }) => {
        if (message.from !== username) {
            return (
                <ItemChatTextLeft
                    profileImage={sendBy(message) ?? ''}
                    message={message.text as string}
                    time={message.time}
                    onAvatarClick={() => handleAvatarClick(message.from)}
                />
            )
        } else {
            return (
                <ItemChatTextRight
                    seen={getSeenBy(message).filter((s): s is string => s !== undefined)}
                    message={message.text as string}
                    time={message.time}
                />
            )
        }
    }

    const ImageMessage = ({ message }: { message: GroupMessageModel }) => {
        if (message.image === null || message.image === undefined) {
            return null
        }
        if (message.from !== username) {
            return (
                <ItemChatImageLeft
                    profileImage={sendBy(message) ?? ''}
                    image={message.image}
                    time={message.time}
                    onAvatarClick={() => handleAvatarClick(message.from)}
                />
            )
        } else {
            return (
                <ItemChatImageRight
                    seen={getSeenBy(message).filter((s): s is string => s !== undefined)}
                    image={message.image}
                    time={message.time}
                />
            )
        }
    }

    const StickerMessage = ({ message }: { message: GroupMessageModel }) => {
        if (message.sticker === null || message.sticker === undefined) {
            return null
        }
        if (message.from !== username) {
            return (
                <ItemChatStickerLeft
                    profileImage={sendBy(message) ?? ''}
                    sticker={message.sticker}
                    time={message.time}
                    onAvatarClick={() => handleAvatarClick(message.from)}
                />
            )
        } else {
            return (
                <ItemChatStickerRight
                    seen={getSeenBy(message).filter((s): s is string => s !== undefined)}
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
            {currentGroupChat.messages.map((message, index) => (
                <div
                    className={'flex gap-2'}
                    key={message.id}
                    ref={index === 0 ? observerTarget : null}>
                    {/*First Message*/}
                    {message.type === GroupMessageType.TypeCreatedGroup && <ItemChatHelloMessage />}
                    {/*Member left message*/}
                    {message.type === GroupMessageType.TypeLeavedMember && (
                        <div className='w-full flex justify-center py-1'>
                            <span className='text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full'>
                                {message.from} left the group
                            </span>
                        </div>
                    )}
                    {/*text Message*/}
                    {message.type === GroupMessageType.TypeText && (
                        <TextMessage message={message} />
                    )}
                    {/*Image Message*/}
                    {message.type === GroupMessageType.TypeImage && (
                        <ImageMessage message={message} />
                    )}
                    {/*Sticker Message*/}
                    {message.type === GroupMessageType.TypeSticker && (
                        <StickerMessage message={message} />
                    )}
                    {/*Deleted Message*/}
                    {message.type === GroupMessageType.TypeDeletedMessage && (
                        <div className='w-full flex justify-center py-2'>
                            <span className='text-sm text-gray-400 italic'>This message was deleted</span>
                        </div>
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

export default GroupChatBox
