import React from 'react'
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

const ChatBox: React.FC = () => {
    const CurrentChats = useChatDetailsStore((state) => state._chatDetails)
    const username = useLocalStore((state) => state.username)

    if (CurrentChats === null) {
        return <EmptyChatFragment />
    }

    return (
        <div
            className={
                'z-0 flex-1 bg-white overflow-y-scroll flex flex-col-reverse ' +
                'scrollbar-thin scrollbar-thumb-slate-500/50 scrollbar-track-white scrollbar-thumb-rounded-full'
            }>
            {CurrentChats.chatMessages.map((chat) => (
                <div className={'flex gap-2'} key={chat.id}>
                    <>
                        {chat.type === ChatMessageType.TypeFirstMessage && <ItemChatHelloMessage />}
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
                    </>
                </div>
            ))}
        </div>
    )
}

export default ChatBox
