import {
    collection,
    doc,
    Firestore,
    query,
    or,
    where,
    getDoc,
    onSnapshot,
} from 'firebase/firestore'
import ChatModel from '../../models/user.chat.model.ts'
import { FirestoreCollections } from '../../constants/FireStoreCollections.ts'

class GetChats {
    static getAllUserChats(
        firestore: Firestore,
        username: string | null,
        onSuccess: (chatList: ChatModel[]) => void
    ) {
        if (!username) {
            onSuccess([])
        }
        const ChatCollection = collection(firestore, FirestoreCollections.CHATS_COLLECTION)

        const chatQuery = query(
            ChatCollection,
            or(
                where('dmChatUser1.username', '==', username),
                where('dmChatUser2.username', '==', username)
            )
        )
        return onSnapshot(
            chatQuery,
            (chatQuerySnapshot) => {
                const ChatList: ChatModel[] = chatQuerySnapshot.docs.map(
                    (doc) => doc.data() as ChatModel
                )
                onSuccess(ChatList)
            },
            (error) => {
                console.error('Issue in getting chats', error)
                onSuccess([])
            }
        )
    }

    static getUserChatById(
        firestore: Firestore,
        chatId: string,
        onSuccess: (chat: ChatModel | null) => void
    ) {
        const ChatRef = doc(firestore, FirestoreCollections.CHATS_COLLECTION, chatId)

        getDoc(ChatRef)
            .then((doc) => {
                if (doc.exists()) {
                    onSuccess(doc.data() as ChatModel)
                } else {
                    onSuccess(null)
                }
            })
            .catch((error) => {
                console.error('Error getting document:', error)
                onSuccess(null)
            })
    }

    static getLiveUserChatById(
        firestore: Firestore,
        chatId: string,
        onSuccess: (chat: ChatModel | null) => void
    ): () => void {
        const ChatRef = doc(firestore, FirestoreCollections.CHATS_COLLECTION, chatId)

        // Listen for real-time updates
        const unsubscribe = onSnapshot(
            ChatRef,
            (doc) => {
                if (doc.exists()) {
                    onSuccess(doc.data() as ChatModel)
                } else {
                    onSuccess(null)
                }
            },
            (error) => {
                console.error('Error getting real-time document:', error)
                onSuccess(null)
            }
        )

        // Return unsubscribe function to stop listening when needed
        return unsubscribe
    }
}

export default GetChats
