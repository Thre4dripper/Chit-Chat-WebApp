import ChatModel from '../../models/user.chat.model.ts'
import { getStorage, ref, listAll, deleteObject } from 'firebase/storage'
import { Firestore, doc, setDoc } from 'firebase/firestore'
import { FirestoreCollections } from '../../constants/FireStoreCollections.ts'
import { StorageFolders } from '../../constants/StorageFolders.ts'
class ClearChat {
    static clearUserChat(
        firestore: Firestore,
        chatModel: ChatModel,
        onSuccess: (done: boolean) => void
    ) {
        const firstMessage = chatModel.chatMessages[chatModel.chatMessages.length - 1]
        const newChatModel = {
            ...chatModel,
            chatMessages: firstMessage ? [firstMessage] : [],
        }

        const docRef = doc(firestore, FirestoreCollections.CHATS_COLLECTION, chatModel.chatId)

        setDoc(docRef, newChatModel)
            .then(() => {
                onSuccess(true)
            })
            .catch(() => {
                onSuccess(false)
            })
    }

    static clearChatImages(
        storage: ReturnType<typeof getStorage>,
        chatModel: ChatModel,
        onSuccess: (done: boolean) => void
    ) {
        const folderPath = `${StorageFolders.CHAT_IMAGES_FOLDER}/${chatModel.chatId}/`
        const folderRef = ref(storage, folderPath)
        listAll(folderRef)
            .then((listResult) => {
                if (listResult.items.length === 0) {
                    onSuccess(true)
                    return
                }
                let completed = 0
                listResult.items.forEach((item) => {
                    deleteObject(item)
                        .then(() => {
                            completed++
                            if (completed === listResult.items.length) onSuccess(true)
                        })
                        .catch((err) => {
                            console.log(err)
                            onSuccess(false)
                        })
                })
            })
            .catch((err) => {
                console.log(err)
                onSuccess(false)
            })
    }
}

export default ClearChat
