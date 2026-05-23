import ChatModel from '../../models/user.chat.model.ts'
import ChatMessageModel from '../../models/chat.message.model.ts'
import { ChatMessageType } from '../../enums/ChatMessageType.ts'
import { v4 as uuidv4 } from 'uuid'
import { FirestoreCollections } from '../../constants/FireStoreCollections.ts'
import { doc, Firestore, setDoc, Timestamp } from 'firebase/firestore'
import UserNotification from '../messaging/UserNotification.ts'

class SendChat {
    static sendTextMessage(
        chatModel: ChatModel,
        firestore: Firestore,
        text: string,
        from: string,
        to: string,
        chatMessageId: (id: string | null) => void
    ) {
        const id = uuidv4()

        // Create a new messages list with the new message added at the beginning
        const newMessagesList = [
            new ChatMessageModel(
                id,
                ChatMessageType.TypeText,
                text,
                null,
                null,
                Timestamp.now(),
                [from],
                from,
                to
            ).toObject(),
            ...chatModel.chatMessages, // Keeping old messages
        ]

        // Update chat model
        const updatedChatModel = { ...chatModel, chatMessages: newMessagesList }

        const docRef = doc(firestore, FirestoreCollections.CHATS_COLLECTION, chatModel.chatId)

        setDoc(docRef, updatedChatModel, { merge: true })
            .then(() => {
                if (!chatModel.mutedBy.includes(to)) {
                    UserNotification.sendTextNotification(firestore, chatModel, from, to, text)
                }
                chatMessageId(id)
            })
            .catch((error) => {
                console.error('Error sending message:', error)
                chatMessageId(null)
            })
    }

    static SendSticker(
        firestore: Firestore,
        chatModel: ChatModel,
        stickerIndex: number,
        from: string,
        to: string,
        chatMessageId: (id: string | null) => void
    ) {
        const id = uuidv4()

        const newMessagesList = [
            new ChatMessageModel(
                id,
                ChatMessageType.TypeSticker,
                null,
                null,
                stickerIndex,
                Timestamp.now(),
                [from],
                from,
                to
            ).toObject(),
            ...chatModel.chatMessages, // Keeping old messages
        ]

        const updatedChatModel = { ...chatModel, chatMessages: newMessagesList }

        const docRef = doc(firestore, FirestoreCollections.CHATS_COLLECTION, chatModel.chatId)

        setDoc(docRef, updatedChatModel, { merge: true })
            .then(() => {
                if (!chatModel.mutedBy.includes(to)) {
                    UserNotification.sendStickerNotification(firestore, chatModel, from, to)
                }
                chatMessageId(id)
            })
            .catch((error) => {
                console.error('Error sending message:', error)
                chatMessageId(null)
            })
    }

    static SendImage(
        firestore: Firestore,
        chatModel: ChatModel,
        imageUrl: string,
        from: string,
        to: string,
        chatMessageId: (id: string | null) => void
    ) {
        const id = uuidv4()

        const newMessagesList = [
            new ChatMessageModel(
                id,
                ChatMessageType.TypeImage,
                null,
                imageUrl,
                null,
                Timestamp.now(),
                [from],
                from,
                to
            ).toObject(),
            ...chatModel.chatMessages, // Keeping old messages
        ]

        const updatedChatModel = { ...chatModel, chatMessages: newMessagesList }

        const docRef = doc(firestore, FirestoreCollections.CHATS_COLLECTION, chatModel.chatId)

        setDoc(docRef, updatedChatModel, { merge: true })
            .then(() => {
                if (!chatModel.mutedBy.includes(to)) {
                    UserNotification.sendImageNotification(firestore, chatModel, from, to, imageUrl)
                }
                chatMessageId(id)
            })
            .catch((error) => {
                console.error('Error sending message:', error)
                chatMessageId(null)
            })
    }
}

export default SendChat
