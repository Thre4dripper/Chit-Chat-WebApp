import GroupChatModel from '../../models/group.chat.model.ts'
import GroupMessageModel from '../../models/group.message.model.ts'
import { v4 as uuidv4 } from 'uuid'
import { FirestoreCollections } from '../../constants/FireStoreCollections.ts'
import { doc, Firestore, setDoc, Timestamp } from 'firebase/firestore'
import { GroupMessageType } from '../../enums/GroupMessageType.ts'

class SendGroupChat {
    static sendTextMessage(
        firestore: Firestore,
        groupChatModel: GroupChatModel,
        text: string,
        from: string,
        chatMessageId: (id: string | null) => void,
    ) {
        const id = uuidv4()
        // Create a new messages list with the new message added at the beginning
        const newMessagesList = [
            new GroupMessageModel(
                id,
                GroupMessageType.TypeText,
                text,
                null,
                null,
                Timestamp.now(),
                [from],
                from
            ).toObject(),
            ...groupChatModel.messages, // Keeping old messages
        ]

        // Update chat model
        const updatedChatModel = { ...groupChatModel, messages: newMessagesList }

        const docRef = doc(firestore, FirestoreCollections.GROUPS_COLLECTION, groupChatModel.id)

        setDoc(docRef, updatedChatModel, { merge: true })
            .then(() => {
                chatMessageId(id)
            })
            .catch((error) => {
                console.error('Error sending message:', error)
                chatMessageId(null)
            })
    }

    static sendSticker(
        firestore:Firestore,
        groupChatModel: GroupChatModel,
        stickerIndex: number,
        from:string,
        chatMessageId:(id: string | null)=>void
    ){
        const id = uuidv4()

        const newMessagesList = [
            new GroupMessageModel(
                id,
                GroupMessageType.TypeSticker,
                null,
                null,
                stickerIndex,
                Timestamp.now(),
                [from],
                from
            ).toObject(),
            ...groupChatModel.messages, // Keeping old messages
        ]

        const updatedChatModel = { ...groupChatModel, messages: newMessagesList }

        const docRef = doc(firestore, FirestoreCollections.GROUPS_COLLECTION, groupChatModel.id)

        setDoc(docRef, updatedChatModel, { merge: true })
            .then(() => {
                // if (!chatModel.mutedBy.includes(to)) {
                //     // TODO send notification to the user
                // }
                chatMessageId(id)
            })
            .catch((error) => {
                console.error('Error sending message:', error)
                chatMessageId(null)
            })

    }

    static sendImage(
        firestore:Firestore,
        groupChatModel: GroupChatModel,
        imageUrl: string,
        from:string,
        chatMessageId:(id: string | null)=>void
    ){
        const id = uuidv4()

        const newMessagesList = [
            new GroupMessageModel(
                id,
                GroupMessageType.TypeImage,
                null,
                imageUrl,
                null,
                Timestamp.now(),
                [from],
                from,
            ).toObject(),
            ...groupChatModel.messages, // Keeping old messages
        ]

        const updatedChatModel = { ...groupChatModel, messages: newMessagesList }

        const docRef = doc(firestore, FirestoreCollections.CHATS_COLLECTION, groupChatModel.id)

        setDoc(docRef, updatedChatModel, { merge: true })
            .then(() => {
                // if (!chatModel.mutedBy.includes(to)) {
                //     // TODO send notification to the user
                // }
                chatMessageId(id)
            })
            .catch((error) => {
                console.error('Error sending message:', error)
                chatMessageId(null)
            })

    }
}

export default SendGroupChat
