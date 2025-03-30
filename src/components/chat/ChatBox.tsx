import React, { useRef,useState,useEffect } from 'react'
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
import { Button } from '@mui/material'
import KeyboardDoubleArrowDownIcon from '@mui/icons-material/KeyboardDoubleArrowDown';

const ChatBox: React.FC = () => {
    const currentChat = useChatDetailsStore((state) => state.chatDetails)
    const username = useLocalStore((state) => state.username)
    const chatContainerRef = useRef<HTMLDivElement>(null)
    const [showScrollButton, setShowScrollButton] = useState(false);

    // Scroll to bottom function
    const scrollToBottom = () => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTo({
                top: chatContainerRef.current.scrollHeight,
                behavior: 'smooth',
            });
            setShowScrollButton(false)
        }
    };
    const debounce = <T extends (...args: any[]) => void>(
        func: T,
        delay: number
    ): ((...args: Parameters<T>) => void) => {
        let timeoutId: ReturnType<typeof setTimeout> | undefined;

        return (...args: Parameters<T>) => {
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
            timeoutId = setTimeout(() => func(...args), delay);
        };
    };

    // Track scrolling
    useEffect(() => {
        const chatContainer = chatContainerRef.current;
        if (!chatContainer) return;

        const handleScroll = debounce(() => {
            setShowScrollButton(chatContainer.scrollTop + chatContainer.clientHeight < chatContainer.scrollHeight - 50);
        }, 100);

        chatContainer.addEventListener('scroll', handleScroll);

        return () => {
            chatContainer.removeEventListener('scroll', handleScroll);
        };
    }, []);
    if (currentChat === null) {
        return <EmptyChatFragment />
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
                    seen={message.seenBy.map((item) =>
                        currentChat.dmChatUser1.username === item
                            ? currentChat.dmChatUser1.profileImage
                            : currentChat.dmChatUser2.profileImage
                    )}
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
                    seen={message.seenBy.map((item) =>
                        currentChat.dmChatUser1.username === item
                            ? currentChat.dmChatUser1.profileImage
                            : currentChat.dmChatUser2.profileImage
                    )}
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
                    seen={message.seenBy.map((item) =>
                        currentChat.dmChatUser1.username === item
                            ? currentChat.dmChatUser1.profileImage
                            : currentChat.dmChatUser2.profileImage
                    )}
                    sticker={message.sticker}
                    time={message.time}
                />
            )
        }
    }

    return (
            <div
                className={
                    'z-0 flex-1 bg-white overflow-y-scroll flex flex-col-reverse relative' +
                    'scrollbar-thin scrollbar-thumb-slate-500/50 scrollbar-track-white scrollbar-thumb-rounded-full'
                }
                ref={chatContainerRef}>
                {currentChat.chatMessages.map((message) => (
                    <div className={'flex gap-2'} key={message.id}>
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
                {showScrollButton &&
                <Button onClick={scrollToBottom} sx={{position:"absolute",right:'50px',bottom:"100px",backgroundColor:"skyblue",borderRadius:'100%',color:'white'}} className="w-12 h-12">
                    <KeyboardDoubleArrowDownIcon/>
                </Button>
                }
            </div>
    )
}

export default ChatBox
