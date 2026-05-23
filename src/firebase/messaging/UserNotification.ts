import { Firestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'
import ChatModel from '../../models/user.chat.model.ts'
import GetDetails from '../user/GetDetails.ts'
import Messaging from './Messaging.ts'
import { ChatType } from '../../enums/ChatType.ts'
import { ChatMessageType } from '../../enums/ChatMessageType.ts'

class UserNotification {
    private static getSenderImage(chatModel: ChatModel, from: string): string {
        if (chatModel.dmChatUser1.username === from) return chatModel.dmChatUser1.profileImage
        if (chatModel.dmChatUser2.username === from) return chatModel.dmChatUser2.profileImage
        return ''
    }

    static sendTextNotification(
        firestore: Firestore,
        chatModel: ChatModel,
        from: string,
        to: string,
        text: string
    ) {
        const senderImage = this.getSenderImage(chatModel, from)
        const senderId = getAuth().currentUser?.uid ?? ''

        GetDetails.getUserDetails(firestore, to, (receiver) => {
            if (!receiver?.fcmToken) return
            Messaging.fireNotification({
                deviceToken: receiver.fcmToken,
                data: {
                    chatType: ChatType.USER,
                    messageType: ChatMessageType.TypeText,
                    notifierName: from,
                    notifierId: senderId,
                    notifierImage: senderImage,
                    chatId: chatModel.chatId,
                    notificationText: text,
                },
            })
        })
    }

    static sendImageNotification(
        firestore: Firestore,
        chatModel: ChatModel,
        from: string,
        to: string,
        imageUrl: string
    ) {
        const senderImage = this.getSenderImage(chatModel, from)
        const senderId = getAuth().currentUser?.uid ?? ''

        GetDetails.getUserDetails(firestore, to, (receiver) => {
            if (!receiver?.fcmToken) return
            Messaging.fireNotification({
                deviceToken: receiver.fcmToken,
                data: {
                    chatType: ChatType.USER,
                    messageType: ChatMessageType.TypeImage,
                    notifierName: from,
                    notifierId: senderId,
                    notifierImage: senderImage,
                    chatId: chatModel.chatId,
                    notificationImage: imageUrl,
                },
            })
        })
    }

    static sendStickerNotification(
        firestore: Firestore,
        chatModel: ChatModel,
        from: string,
        to: string
    ) {
        const senderImage = this.getSenderImage(chatModel, from)
        const senderId = getAuth().currentUser?.uid ?? ''

        GetDetails.getUserDetails(firestore, to, (receiver) => {
            if (!receiver?.fcmToken) return
            Messaging.fireNotification({
                deviceToken: receiver.fcmToken,
                data: {
                    chatType: ChatType.USER,
                    messageType: ChatMessageType.TypeSticker,
                    notifierName: from,
                    notifierId: senderId,
                    notifierImage: senderImage,
                    chatId: chatModel.chatId,
                },
            })
        })
    }
}

export default UserNotification
