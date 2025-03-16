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
    const currentChat = useChatDetailsStore((state) => state.chatDetails)
    const username = useLocalStore((state) => state.username)

    if (currentChat === null) {
        return <EmptyChatFragment />
    }

    return (
        <div
            className={
                'z-0 flex-1 bg-white overflow-y-scroll flex flex-col-reverse ' +
                'scrollbar-thin scrollbar-thumb-slate-500/50 scrollbar-track-white scrollbar-thumb-rounded-full'
            }>
            {currentChat.chatMessages.map((message) => (
                <div className={'flex gap-2'} key={message.id}>
                    {/*dm*/}
                    {message.type === ChatMessageType.TypeFirstMessage && <ItemChatHelloMessage />}
                    {/*text Message */}
                    {message.type === ChatMessageType.TypeText &&
                        (message.from !== username ? (
                            <ItemChatTextLeft
                                profileImage={
                                    currentChat.dmChatUser2.username === username
                                        ? currentChat.dmChatUser1.profileImage
                                        : currentChat.dmChatUser2.profileImage
                                }
                                message={message.text as string}
                                time={message.time}
                            />
                        ) : (
                            <ItemChatTextRight
                                seen={message.seenBy.map((item) =>
                                    currentChat.dmChatUser1.username === item
                                        ? currentChat.dmChatUser1.profileImage
                                        : currentChat.dmChatUser2.profileImage
                                )}
                                message={message.text as string}
                                time={message.time}
                            />
                        ))}
                    {/*Image message*/}
                    {message.type === ChatMessageType.TypeImage &&
                        message.image &&
                        (message.from !== username ? (
                            <ItemChatImageLeft
                                profileImage={
                                    currentChat.dmChatUser2.username === username
                                        ? currentChat.dmChatUser1.profileImage
                                        : currentChat.dmChatUser2.profileImage
                                }
                                image={message.image}
                                time={message.time}
                            />
                        ) : (
                            <ItemChatImageRight
                                seen={message.seenBy.map((item) =>
                                    currentChat.dmChatUser1.username === item
                                        ? currentChat.dmChatUser1.profileImage
                                        : currentChat.dmChatUser2.profileImage
                                )}
                                image={message.image}
                                time={message.time}
                            />
                        ))}
                    {/*stickers */}
                    {message.type === ChatMessageType.TypeSticker &&
                        message.sticker !== null &&
                        message.sticker !== undefined &&
                        (message.from !== username ? (
                            <ItemChatStickerLeft
                                profileImage={
                                    currentChat.dmChatUser2.username === username
                                        ? currentChat.dmChatUser1.profileImage
                                        : currentChat.dmChatUser2.profileImage
                                }
                                sticker={message.sticker}
                                time={message.time}
                            />
                        ) : (
                            <ItemChatStickerRight
                                seen={message.seenBy.map((item) =>
                                    currentChat.dmChatUser1.username === item
                                        ? currentChat.dmChatUser1.profileImage
                                        : currentChat.dmChatUser2.profileImage
                                )}
                                sticker={message.sticker}
                                time={message.time}
                            />
                        ))}
                </div>
            ))}
        </div>
    )
}

export default ChatBox
