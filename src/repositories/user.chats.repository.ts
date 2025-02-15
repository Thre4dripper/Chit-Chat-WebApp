import { getFirestore } from 'firebase/firestore'
import firebaseApp from '../firebase/FirebaseInit.ts'
import GetChats from '../firebase/chats/GetChats.ts'
import useHomeChatsStore from '../store/home.chats.store.ts'
import useLocalStore from '../store/local.store.ts'
import { ChatType } from '../enums/ChatType.ts'
import ChatModel from '../models/user.chat.model.ts'
import HomeChatModel from '../models/home.chat.model.ts'

class UserChatsRepository {
    static getAllUserChats() {
        const firestore = getFirestore(firebaseApp)

        const loggedInUser = useLocalStore.getState().username

        GetChats.getAllUserChats(firestore, loggedInUser, (userChats) => {
            useHomeChatsStore.getState().homeChats = []
            const newList: HomeChatModel[] = []
            userChats.forEach((chat) => {
                newList.push(
                    new HomeChatModel(
                        chat.chatId,
                        ChatType.USER,
                        chat,
                        null,
                        chat.chatMessages[0].time || 0
                    )
                )
            })
            //     sort them based on time stamp

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
}

export default UserChatsRepository
