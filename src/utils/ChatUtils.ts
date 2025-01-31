import { Firestore, getDoc, doc } from 'firebase/firestore'
import ChatModel from '../models/user.chat.model.ts'
import { FirestoreCollections } from '../constants/FireStoreCollections.ts'

class ChatUtils {
    static getUserChatDocId(chatUserId1: string, chatUserId2: string): string {
        if (chatUserId1 < chatUserId2) {
            return chatUserId1 + '-' + chatUserId2
        }
        return chatUserId2 + '-' + chatUserId1
    }
    static checkIfUserChatExists(
        firestore: Firestore,
        chatUserId1: string,
        chatUserId2: string,
        chatId: (id: string | null) => void
    ) {
        const chatDocId = this.getUserChatDocId(chatUserId1, chatUserId2)
        const docRef = doc(firestore, FirestoreCollections.CHATS_COLLECTION, chatDocId)
        getDoc(docRef)
            .then((doc) => {
                if (doc.exists()) {
                    chatId(chatDocId)
                } else {
                    chatId(null)
                }
            })
            .catch((error) => {
                chatId(null)
                console.log('Error in getting Chat doc', error)
            })
    }
    static getUserChatProfileImage = (chatModel: ChatModel, loggedInUsername: string): string => {
        if (chatModel.dmChatUser1.username === loggedInUsername) {
            return chatModel.dmChatUser2.profileImage
        }
        return chatModel.dmChatUser1.profileImage
    }
    static getUserChatUsername = (chatModel: ChatModel, loggedInUsername: string): string => {
        if (chatModel.dmChatUser1.username === loggedInUsername) {
            return chatModel.dmChatUser2.username
        }
        return chatModel.dmChatUser1.username
    }

    static getUserChatStatus = (chatModel: ChatModel, loggedInUsername: string): string => {
        if (chatModel.dmChatUser1.username === loggedInUsername) {
            return chatModel.dmChatUser2.status
        }
        return chatModel.dmChatUser1.status
    }

    // getGroupChatProfileImage group will TODO
}

export default ChatUtils
