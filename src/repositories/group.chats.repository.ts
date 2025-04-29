import { getFirestore } from 'firebase/firestore'
import firebaseApp from '../firebase/FirebaseInit.ts'
import useHomeStore from '../store/home.store.ts'
import GroupChatModel from '../models/group.chat.model.ts'
import GetGroupChats from '../firebase/chats/GetGroupChats.ts'
import useHomeChatsStore from '../store/home.chats.store.ts'
import { ChatType } from '../enums/ChatType.ts'
import homeChatModel from '../models/home.chat.model.ts'
import useLocalStore from '../store/local.store.ts'

class GroupChatsRepository {
    static getAllGroupChats() {
        const firestore = getFirestore(firebaseApp)
        const loggedInUsername= useLocalStore.getState().username
        const userImage = useHomeStore.getState().user?.profileImage
        if (!loggedInUsername || !userImage) return
        const groupUserModel = {
            username: loggedInUsername,
            profileImage: userImage
        }
        GetGroupChats.getAllGroupChats(firestore, groupUserModel, (groupChats) => {
            const oldList = useHomeChatsStore
                .getState()
                .homeChats.filter((item) => item.type !== ChatType.GROUP)
            const newChats = groupChats.map(
                (chat) =>
                    new homeChatModel(chat.id, ChatType.GROUP, null, chat, chat.messages[0]?.time)
            )
            const newList = [...oldList, ...newChats]
            newList.sort((a, b) => {
                return b.lastMessageTimestamp.toMillis() - a.lastMessageTimestamp.toMillis()
            })
            useHomeChatsStore.setState({ homeChats: newList })
        })
    }

    static getLiveGroupChatById(
        chatId: string,
        chatModel: (GroupChatModel: GroupChatModel | null) => void
    ) {
        const firestore = getFirestore(firebaseApp)
        GetGroupChats.getLiveGroupChatById(firestore, chatId, chatModel)
    }
}

export default GroupChatsRepository
