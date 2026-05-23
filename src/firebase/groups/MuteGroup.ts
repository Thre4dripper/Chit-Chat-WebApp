import { Firestore, doc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore'
import GroupChatModel from '../../models/group.chat.model.ts'
import { FirestoreCollections } from '../../constants/FireStoreCollections.ts'

/**
 * Mute/unmute a group chat by adding/removing username from mutedBy array.
 * Mirrors Android's Messaging.muteGroupChat() functionality.
 * When a user is in mutedBy array, notifications are muted for that user.
 */
class MuteGroup {
    static muteUnMuteGroupChat(
        firestore: Firestore,
        groupChat: GroupChatModel,
        username: string,
        isMute: boolean,
        onSuccess: (success: boolean) => void
    ) {
        try {
            const groupRef = doc(firestore, FirestoreCollections.GROUPS_COLLECTION, groupChat.id)

            if (isMute) {
                // Add username to mutedBy array
                updateDoc(groupRef, {
                    mutedBy: arrayUnion(username),
                }).then(() => {
                    onSuccess(true)
                })
            } else {
                // Remove username from mutedBy array
                updateDoc(groupRef, {
                    mutedBy: arrayRemove(username),
                }).then(() => {
                    onSuccess(true)
                })
            }
        } catch (error) {
            console.error('Error updating group mute status:', error)
            onSuccess(false)
        }
    }
}

export default MuteGroup
