import { Firestore, doc, setDoc } from 'firebase/firestore'
import ChatModel from '../../models/user.chat.model.ts'
import GroupChatModel from '../../models/group.chat.model.ts'
import { FirestoreCollections } from '../../constants/FireStoreCollections.ts'

class UpdateSeen {
    static updateSeen(
        firestore: Firestore,
        chatModel: ChatModel,
        loggedInUser: string,
        onSuccess: (check: boolean) => void
    ) {
        const newMessagesList = chatModel.chatMessages.map((message) => {
            if (message.from !== loggedInUser) {
                const seenBy = message.seenBy
                if (!seenBy.includes(loggedInUser)) {
                    seenBy.push(loggedInUser)
                }
                return { ...message, seenBy }
            }
            return message
        })
        const DocRef = doc(firestore, FirestoreCollections.CHATS_COLLECTION, chatModel.chatId)

        setDoc(DocRef, { chatMessages: newMessagesList }, { merge: true })
            .then(() => {
                onSuccess(true)
            })
            .catch((error) => {
                console.error('Error updating seen:', error)
                onSuccess(false)
            })
    }

    static updateGroupSeen(
        firestore: Firestore,
        groupChatModel: GroupChatModel,
        loggedInUser: string,
        onSuccess: (check: boolean) => void
    ) {
        const newMessagesList = groupChatModel.messages.map((message) => {
            if (message.from !== loggedInUser) {
                const seenBy = [...message.seenBy]
                if (!seenBy.includes(loggedInUser)) {
                    seenBy.push(loggedInUser)
                }
                return { ...message, seenBy }
            }
            return message
        })

        const docRef = doc(firestore, FirestoreCollections.GROUPS_COLLECTION, groupChatModel.id)

        setDoc(docRef, { messages: newMessagesList }, { merge: true })
            .then(() => {
                onSuccess(true)
            })
            .catch((error) => {
                console.error('Error updating group seen:', error)
                onSuccess(false)
            })
    }
}

export default UpdateSeen
