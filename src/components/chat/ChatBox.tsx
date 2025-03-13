import React, { useEffect, useRef } from 'react'
import { ChatMessageType } from '../../enums/ChatMessageType.ts'
import useChatDetailsStore from '../../store/chat.details.store.ts'
import useLocalStore from '../../store/local.store.ts'
import ItemChatTextLeft from '../listItems/ItemChatTextLeft.tsx'
import ItemChatHelloMessage from '../listItems/ItemChatHelloMessage.tsx'
import ItemChatImageLeft from '../listItems/ItemChatImageLeft.tsx'
import ItemChatStickerLeft from '../listItems/ItemChatStickerLeft.tsx'
import ItemChatTextRight from '../listItems/ItemChatTextRight.tsx'
import ItemChatImageRight from '../listItems/ItemChatImageRight.tsx'
import ItemChatStickerRight from '../listItems/ItemChatStickerRight.tsx'

const ChatBox: React.FC = () => {
    const bottomRef = useRef<HTMLDivElement>(null)

    const CurrentChats = useChatDetailsStore((state) => state._chatDetails)
    const username = useLocalStore((state) => state.username)

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [CurrentChats])
    return (
        <div
            className={
                'z-0 flex-1 bg-white overflow-y-scroll ' +
                'scrollbar-thin scrollbar-thumb-slate-500/50 scrollbar-track-white scrollbar-thumb-rounded-full'
            }>
            {CurrentChats && <ItemChatHelloMessage />}

            {CurrentChats ? (
                [...CurrentChats.chatMessages].reverse().map((chat) => (
                    <div className={'flex gap-2'} key={chat.time.toMillis()}>
                        {chat.from !== username ? (
                            <>
                                {chat.type === ChatMessageType.TypeText && (
                                    <ItemChatTextLeft
                                        profileImage={
                                            CurrentChats.dmChatUser2.username === username
                                                ? CurrentChats.dmChatUser1.profileImage
                                                : CurrentChats.dmChatUser2.profileImage
                                        }
                                        message={chat.text as string}
                                        time={chat.time}
                                    />
                                )}

                                {chat.type === ChatMessageType.TypeImage && chat.image && (
                                    <ItemChatImageLeft
                                        profileImage={
                                            CurrentChats.dmChatUser2.username === username
                                                ? CurrentChats.dmChatUser1.profileImage
                                                : CurrentChats.dmChatUser2.profileImage
                                        }
                                        image={chat.image}
                                        time={chat.time}
                                    />
                                )}

                                {chat.type === ChatMessageType.TypeSticker &&
                                    chat.sticker !== null &&
                                    chat.sticker !== undefined && (
                                        <ItemChatStickerLeft
                                            profileImage={
                                                CurrentChats.dmChatUser2.username === username
                                                    ? CurrentChats.dmChatUser1.profileImage
                                                    : CurrentChats.dmChatUser2.profileImage
                                            }
                                            sticker={chat.sticker}
                                            time={chat.time}
                                        />
                                    )}
                            </>
                        ) : (
                            <>
                                {chat.type === ChatMessageType.TypeText && (
                                    <ItemChatTextRight
                                        seen={chat.seenBy.map((item) =>
                                            CurrentChats.dmChatUser1.username === item
                                                ? CurrentChats.dmChatUser1.profileImage
                                                : CurrentChats.dmChatUser2.profileImage
                                        )}
                                        message={chat.text as string}
                                        time={chat.time}
                                    />
                                )}

                                {chat.type === ChatMessageType.TypeImage && chat.image && (
                                    <ItemChatImageRight
                                        seen={chat.seenBy.map((item) =>
                                            CurrentChats.dmChatUser1.username === item
                                                ? CurrentChats.dmChatUser1.profileImage
                                                : CurrentChats.dmChatUser2.profileImage
                                        )}
                                        image={chat.image}
                                        time={chat.time}
                                    />
                                )}

                                {chat.type === ChatMessageType.TypeSticker &&
                                    chat.sticker !== null &&
                                    chat.sticker !== undefined && (
                                        <ItemChatStickerRight
                                            seen={chat.seenBy.map((item) =>
                                                CurrentChats.dmChatUser1.username === item
                                                    ? CurrentChats.dmChatUser1.profileImage
                                                    : CurrentChats.dmChatUser2.profileImage
                                            )}
                                            sticker={chat.sticker}
                                            time={chat.time}
                                        />
                                    )}
                            </>
                        )}
                        <div ref={bottomRef} />
                    </div>
                ))
            ) : (
                <div className='flex items-center justify-center h-screen overflow-hidden bg-gray-800'>
                    <div className='text-center'>
                        <div className='mb-8'>
                            <svg
                                xmlns='http://www.w3.org/2000/svg'
                                className='h-16 w-16 mx-auto text-gray-400'
                                fill='none'
                                viewBox='0 0 24 24'
                                stroke='currentColor'>
                                <path
                                    strokeLinecap='round'
                                    strokeLinejoin='round'
                                    strokeWidth={2}
                                    d='M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z'
                                />
                            </svg>
                        </div>
                        <h1 className='text-3xl font-semibold text-white mb-4'>
                            ChitChat for Website
                        </h1>
                        <p className='text-gray-300 mb-6'>
                            Send and receive messages without keeping your device online.
                            <br />
                            Use ChitChat anywhere easily.
                        </p>
                        <p className='text-gray-400 text-sm'>
                            <svg
                                xmlns='http://www.w3.org/2000/svg'
                                className='h-4 w-4 inline-block mr-1'
                                fill='none'
                                viewBox='0 0 24 24'
                                stroke='currentColor'>
                                <path
                                    strokeLinecap='round'
                                    strokeLinejoin='round'
                                    strokeWidth={2}
                                    d='M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z'
                                />
                            </svg>
                            End-to-end encrypted
                        </p>
                    </div>
                </div>
            )}
        </div>
    )
}

export default ChatBox
