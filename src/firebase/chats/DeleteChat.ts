import { Firestore, doc, deleteDoc } from 'firebase/firestore'
import ChatModel from '../../models/user.chat.model.ts'
import { FirestoreCollections } from '../../constants/FireStoreCollections.ts'

class DeleteChat {
    static deleteUserChat(
        firestore: Firestore,
        chatModel: ChatModel,
        onSuccess: (set: boolean) => void
    ) {
        const ChatCollection = doc(
            firestore,
            FirestoreCollections.CHATS_COLLECTION,
            chatModel.chatId
        )

        deleteDoc(ChatCollection)
            .then(() => {
                onSuccess(true)
            })
            .catch((err) => {
                onSuccess(false)
                console.log(err)
            })
    }
}

export default DeleteChat
