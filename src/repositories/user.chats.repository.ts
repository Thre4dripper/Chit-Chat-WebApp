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
        if (!loggedInUser) {
            return
        }

        GetChats.getAllUserChats(firestore, loggedInUser, (userChats) => {
            const oldList=useHomeChatsStore.getState().homeChats
            let updatedList= oldList;
            updatedList = updatedList.filter(item => item.type !== ChatType.USER);
            updatedList = [
                ...updatedList,
                ...userChats.map(chat =>
                    new HomeChatModel(
                        chat.chatId,
                        ChatType.USER,
                        chat,
                        null,
                        chat.chatMessages[0]?.time
                    )
                )
            ];

            //   tell me Here I have Done A sort in descending order as in android
            //   if You need to use reverse can I change it to increasing order here Just asking
            updatedList.sort((a, b) => {
                return b.lastMessageTimestamp.toMillis() - a.lastMessageTimestamp.toMillis()
            })
            // Tell which one i choose

            useHomeChatsStore.getState().homeChats=updatedList

            // useHomeChatsStore.setState({ homeChats: updatedList })
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
