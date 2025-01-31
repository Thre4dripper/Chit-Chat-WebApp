import { getFirestore } from 'firebase/firestore'
import firebaseApp from '../firebase/FirebaseInit.ts'
import GetChats from '../firebase/chats/GetChats.ts'
import AddChatsStore from '../store/add.chats.store.ts'
import useLocalStore from '../store/local.store.ts'
import ChatModel from '../models/user.chat.model.ts'

class UserChatsRepository {
    static getAllUserChats() {
        const firestore = getFirestore(firebaseApp)

        const loggedInUser = useLocalStore.getState().username

        GetChats.getAllUserChats(firestore, loggedInUser, (userChats) => {
            AddChatsStore.setState({ UserChats: userChats })
        })
    }

    static getUserChatById(chatId: string, onSuccess: (chat: ChatModel | null) => void) {
        const firestore = getFirestore(firebaseApp)
        GetChats.getUserChatById(firestore, chatId, onSuccess)
    }
}

export default UserChatsRepository
