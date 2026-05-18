import React, { SetStateAction, useEffect, useRef, useState } from 'react'
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
    const currentGroupChat = useChatDetailsStore((state) => state.groupChatDetails)
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
    const sendBy=(message:GroupMessageModel)=>{
        const sender = currentGroupChat.members.find(
            (member) => member.username === message.from
        );
        return sender?.profileImage;
    }

    const getSeenBy = (message: GroupMessageModel) => {
        // return profile image of users who have seen the message except the sender
        return message.seenBy
            .filter((item) => item !== username)
            .map((item)=> {
                const member = currentGroupChat.members.find((member) => member.username === item);
                return member?.profileImage
            })
    }
    const TextMessage = ({ message }: { message: GroupMessageModel }) => {
        if (message.from !== username) {
            return (
                <ItemChatTextLeft
                    profileImage={sendBy(message) as string}
                    message={message.text as string}
                    time={message.time}
                />
            )
        } else {
            return (
                <ItemChatTextRight
                    seen={getSeenBy(message) as string[]}
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
                    profileImage={sendBy(message) as string}
                    image={message.image}
                    time={message.time}
                />
            )
        } else {
            return (
                <ItemChatImageRight
                    seen={getSeenBy(message) as string[]}
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
                    profileImage={sendBy(message) as string}
                    sticker={message.sticker}
                    time={message.time}
                />
            )
        } else {
            return (
                <ItemChatStickerRight
                    seen={getSeenBy(message) as string[]}
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
                    {/*text Message*/}
                    {message.type === GroupMessageType.TypeText && (
                        <TextMessage message={message} />
                    )}
                    {/*Image Message*/}
                    {/* eslint-disable-next-line react/prop-types */}
                    {message.type === GroupMessageType.TypeImage && (
                        <ImageMessage message={message} />
                    )}
                    {/*Sticker Message*/}
                    {message.type === GroupMessageType.TypeSticker && (
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

export default GroupChatBox