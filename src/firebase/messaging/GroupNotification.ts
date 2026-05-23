import { Firestore } from 'firebase/firestore'
import GroupChatModel from '../../models/group.chat.model.ts'
import GetDetails from '../user/GetDetails.ts'
import Messaging from './Messaging.ts'
import { ChatType } from '../../enums/ChatType.ts'
import { ChatMessageType } from '../../enums/ChatMessageType.ts'

class GroupNotification {
    private static getSenderImage(groupChatModel: GroupChatModel, from: string): string {
        return groupChatModel.members.find((m) => m.username === from)?.profileImage ?? ''
    }

    private static sendToGroupMembers(
        firestore: Firestore,
        groupChatModel: GroupChatModel,
        from: string,
        data: Record<string, string>
    ) {
        const eligibleMembers = groupChatModel.members.filter(
            (m) => m.username !== from && !groupChatModel.mutedBy.includes(m.username)
        )
        eligibleMembers.forEach((member) => {
            GetDetails.getUserDetails(firestore, member.username, (user) => {
                if (!user?.fcmToken) return
                Messaging.fireNotification({ deviceToken: user.fcmToken, data })
            })
        })
    }

    private static buildBaseData(
        groupChatModel: GroupChatModel,
        from: string
    ): Record<string, string> {
        const senderImage = this.getSenderImage(groupChatModel, from)
        const base: Record<string, string> = {
            chatType: ChatType.GROUP,
            notifierName: from,
            notifierImage: senderImage,
            group_id: groupChatModel.id,
            name: groupChatModel.name,
        }
        // Only include image if it's a real URL — avoids Android image loader crash on empty string
        if (groupChatModel.image) {
            base.image = groupChatModel.image
        }
        return base
    }

    static sendTextNotification(
        firestore: Firestore,
        groupChatModel: GroupChatModel,
        from: string,
        text: string
    ) {
        this.sendToGroupMembers(firestore, groupChatModel, from, {
            ...this.buildBaseData(groupChatModel, from),
            messageType: ChatMessageType.TypeText,
            notificationText: text,
        })
    }

    static sendImageNotification(
        firestore: Firestore,
        groupChatModel: GroupChatModel,
        from: string,
        imageUrl: string
    ) {
        this.sendToGroupMembers(firestore, groupChatModel, from, {
            ...this.buildBaseData(groupChatModel, from),
            messageType: ChatMessageType.TypeImage,
            notificationImage: imageUrl,
        })
    }

    static sendStickerNotification(
        firestore: Firestore,
        groupChatModel: GroupChatModel,
        from: string
    ) {
        this.sendToGroupMembers(firestore, groupChatModel, from, {
            ...this.buildBaseData(groupChatModel, from),
            messageType: ChatMessageType.TypeSticker,
        })
    }
}

export default GroupNotification
