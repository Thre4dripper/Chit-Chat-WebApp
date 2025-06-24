import ChatModel from '../../models/user.chat.model.ts'
import { getStorage, ref, listAll, deleteObject } from 'firebase/storage'
class ClearChat {
    static clearChatImages(
        storage: ReturnType<typeof getStorage>,
        chatModel: ChatModel,
        onSuccess: (done: boolean) => void
    ) {
        const folderPath = `chat_images/${chatModel.chatId}/`
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
