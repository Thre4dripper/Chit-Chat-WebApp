import { getFirestore } from 'firebase/firestore'
import firebaseApp from '../firebase/FirebaseInit.ts'
import GetChats from '../firebase/chats/GetChats.ts'
import useHomeChatsStore from '../store/home.chats.store.ts'
import useLocalStore from '../store/local.store.ts'
import { ChatType } from '../enums/ChatType.ts'
import ChatModel from '../models/user.chat.model.ts'
import HomeChatModel from '../models/home.chat.model.ts'
import SendChat from '../firebase/chats/SendChat.ts'

class UserChatsRepository {
    static getAllUserChats() {
        const firestore = getFirestore(firebaseApp)

        const loggedInUser = useLocalStore.getState().username
        if (!loggedInUser) {
            return
        }

        GetChats.getAllUserChats(firestore, loggedInUser, (userChats) => {
            const oldList = useHomeChatsStore
                .getState()
                .homeChats.filter((item) => item.type !== ChatType.USER)
            const newList = [
                ...oldList,
                ...userChats.map(
                    (chat) =>
                        new HomeChatModel(
                            chat.chatId,
                            ChatType.USER,
                            chat,
                            null,
                            chat.chatMessages[0]?.time
                        )
                ),
            ]

            newList.sort((a, b) => {
                return b.lastMessageTimestamp.toMillis() - a.lastMessageTimestamp.toMillis()
            })
            useHomeChatsStore.setState({ homeChats: newList })
        })
    }

    static getUserChatById(chatId: string, onSuccess: (chat: ChatModel | null) => void) {
        const firestore = getFirestore(firebaseApp)
        GetChats.getUserChatById(firestore, chatId, onSuccess)
    }

    static getLiveUserChatById(chatId: string, chatModel: (chatModel: ChatModel | null) => void) {
        const firestore = getFirestore(firebaseApp)
        return GetChats.getLiveUserChatById(firestore, chatId, chatModel)
    }
    static sendTextMessage(
        chatModel: ChatModel,
        text: string,
        from: string,
        to: string,
        chatMessageId: (id: string | null) => void
    ) {
        const firestore = getFirestore(firebaseApp)
        SendChat.sendTextMessage(chatModel, firestore, text, from, to, chatMessageId)
    }
}

export default UserChatsRepository
