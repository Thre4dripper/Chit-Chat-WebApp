import { doc, Firestore, setDoc, Timestamp } from 'firebase/firestore'
import UserModel from '../../models/user.model.ts'
import ChatUtils from '../../utils/ChatUtils.ts'
import ChatModel, { DMChatUserModel } from '../../models/user.chat.model.ts'
import { UserStatus } from '../../enums/UserStatus.ts'
import { FirestoreCollections } from '../../constants/FireStoreCollections.ts'
import ChatMessageModel from '../../models/chat.message.model.ts'
import { ChatMessageType } from '../../enums/ChatMessageType.ts'
import { v4 as uuid } from 'uuid'
class AddNewChat {
    static addNewChat(
        firestore: Firestore,
        newChatUser: UserModel,
        currentUser: UserModel,
        chatId: (id: string | null) => void
    ) {
        const chatDocId = ChatUtils.getUserChatDocId(currentUser.uid, newChatUser.uid)
        const data = new ChatModel(
            chatDocId,
            new DMChatUserModel(
                currentUser.username,
                currentUser.profileImage,
                UserStatus.Online
            ).toObject(),
            new DMChatUserModel(
                newChatUser.username,
                newChatUser.profileImage,
                UserStatus.LastSeen + Timestamp.now().seconds
            ).toObject(),
            [
                new ChatMessageModel(
                    uuid(),
                    ChatMessageType.TypeText,
                    `Hi, I am ${currentUser.username}`,
                    null,
                    null,
                    Timestamp.now(),
                    [currentUser.username],
                    currentUser.username,
                    newChatUser.username
                ).toObject(),
                new ChatMessageModel(
                    uuid(),
                    ChatMessageType.TypeFirstMessage,
                    null,
                    null,
                    null,
                    Timestamp.now(),
                    [currentUser.username],
                    currentUser.username,
                    newChatUser.username
                ).toObject(),
            ],
            []
        )

        const docRef = doc(firestore,FirestoreCollections.CHATS_COLLECTION,chatDocId)
        setDoc(docRef, data.toObject())
            .then(() => {
                chatId(chatDocId)
            })
            .catch((e) => {
                console.log('Error in Chat Document', e)
                chatId(null)
            })
    }
}

export default AddNewChat
