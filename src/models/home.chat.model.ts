import BaseModel from './base.model.ts'
import { ChatType } from '../enums/ChatType.ts'
import ChatModel from './user.chat.model.ts'
import { Timestamp } from '@firebase/firestore'
import GroupChatModel from './group.chat.model.ts'

class HomeChatModel extends BaseModel {
    id: string
    type: ChatType
    userChat: ChatModel | null
    groupChat: GroupChatModel | null
    lastMessageTimestamp: Timestamp

    constructor(
        id: string,
        type: ChatType,
        userChat: ChatModel | null,
        groupChat: GroupChatModel | null, // string as no Group model yet
        lastMessageTimestamp: Timestamp
    ) {
        super()
        this.id = id
        this.type = type
        this.userChat = userChat
        this.groupChat = groupChat
        this.lastMessageTimestamp = lastMessageTimestamp
    }
}

export default HomeChatModel
