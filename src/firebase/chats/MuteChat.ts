import { Firestore, doc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore'
import ChatModel from '../../models/user.chat.model.ts'
import { FirestoreCollections } from '../../constants/FireStoreCollections.ts'

/**
 * Mute/unmute a direct message chat by adding/removing username from mutedBy array.
 * Mirrors Android's Messaging.muteChat() functionality.
 * When a user is in mutedBy array, notifications are muted for that user.
 */
class MuteChat {
    static muteUnMuteChat(
        firestore: Firestore,
        chatModel: ChatModel,
        username: string,
        isMute: boolean,
        onSuccess: (success: boolean) => void
    ) {
        try {
            const chatRef = doc(firestore, FirestoreCollections.CHATS_COLLECTION, chatModel.chatId)

            if (isMute) {
                // Add username to mutedBy array
                updateDoc(chatRef, {
                    mutedBy: arrayUnion(username),
                }).then(() => {
                    onSuccess(true)
                })
            } else {
                // Remove username from mutedBy array
                updateDoc(chatRef, {
                    mutedBy: arrayRemove(username),
                }).then(() => {
                    onSuccess(true)
                })
            }
        } catch (error) {
            console.error('Error updating mute status:', error)
            onSuccess(false)
        }
    }
}

export default MuteChat
