import React, { useEffect, useRef } from 'react'
import LeftChatMessage from '../chatMessages/LeftChatMessage.tsx'
import { ChatMessageType } from '../../enums/ChatMessageType.ts'
// import stickerData from '../../assets/stickers/sticker_ghost_1.json'
import stickerData from '../../assets/stickers/sticker_owl_1.json'
import RightChatMessage from '../chatMessages/RightChatMessage.tsx'
import useHomeChatsStore from '../../store/home.chats.store.ts'
import useLocalStore from '../../store/local.store.ts'


const ChatBox: React.FC = () => {
    // for scrolling to bottom
    const bottomRef = useRef<HTMLDivElement>(null)


    const CurrentChats = useHomeChatsStore((state) => state._chatDetails);

    const username=useLocalStore((state)=>state.username)

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [CurrentChats])
    return (
        <div
            className={
                'z-0 flex-1 bg-white overflow-y-scroll ' +
                'scrollbar-thin scrollbar-thumb-slate-500/50 scrollbar-track-white scrollbar-thumb-rounded-full'
            }>
            {CurrentChats ? [...CurrentChats.chatMessages]
                .reverse()
                .map((chat) => (
                    <div className={'flex gap-2'} key={chat.time.toMillis()}>
                        {chat.from !== username ? (
                            <>
                                {chat.type === ChatMessageType.TypeText && (
                                    <LeftChatMessage
                                        type={ChatMessageType.TypeText}
                                        profileImage={CurrentChats.dmChatUser2.profileImage}
                                        message={chat.text as string}
                                        time={chat.time.toDate().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                                    />
                                )}

                                {chat.type === ChatMessageType.TypeImage && chat.image && (
                                    <LeftChatMessage
                                        type={ChatMessageType.TypeImage}
                                        profileImage={CurrentChats.dmChatUser2.profileImage}
                                        image={chat.image}
                                        time={chat.time.toDate().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                                    />
                                )}

                                {chat.type === ChatMessageType.TypeSticker && chat.sticker && (
                                    <LeftChatMessage
                                        type={ChatMessageType.TypeSticker}
                                        profileImage={CurrentChats.dmChatUser2.profileImage}
                                        sticker={stickerData}
                                        time={chat.time.toDate().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                                    />
                                )}

                                {chat.type === ChatMessageType.TypeFirstMessage && (
                                    <LeftChatMessage
                                        type={ChatMessageType.TypeSticker}
                                        profileImage={CurrentChats.dmChatUser2.profileImage}
                                        sticker={stickerData} // ✅ Default first message sticker
                                        time={chat.time.toDate().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                                    />
                                )}
                            </>
                        ) : (
                            <>
                                {chat.type === ChatMessageType.TypeText && (
                                    <RightChatMessage
                                        type={ChatMessageType.TypeText}
                                        seen={[CurrentChats.dmChatUser1.profileImage as string]}
                                        message={chat.text as string}
                                        time={chat.time.toDate().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                                    />
                                )}

                                {chat.type === ChatMessageType.TypeImage && chat.image && (
                                    <RightChatMessage
                                        type={ChatMessageType.TypeImage}
                                        seen={[CurrentChats.dmChatUser1.profileImage as string]}
                                        image={chat.image}
                                        time={chat.time.toDate().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                                    />
                                )}

                                {chat.type === ChatMessageType.TypeSticker && chat.sticker && (
                                    <RightChatMessage
                                        type={ChatMessageType.TypeSticker}
                                        seen={[CurrentChats.dmChatUser1.profileImage as string]}
                                        sticker={stickerData}
                                        time={chat.time.toDate().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                                    />
                                )}

                                {chat.type === ChatMessageType.TypeFirstMessage && (
                                    <RightChatMessage
                                        type={ChatMessageType.TypeSticker}
                                        seen={[CurrentChats.dmChatUser1.profileImage as string]}
                                        sticker={stickerData} // ✅ Default first message sticker
                                        time={chat.time.toDate().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                                    />
                                )}
                            </>
                        )}
                    <div ref={bottomRef} />
                </div>
            )):<div className={`flex flex-col gap-2`}>
                  Select Any Chat from Left
            </div>
            }
        </div>
    )
}

export default ChatBox
