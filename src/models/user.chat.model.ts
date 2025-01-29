import BaseModel from './base.model.ts'
import ChatMessageModel from './chat.message.model.ts'

class ChatModel extends BaseModel {
    chatId: string
    dmChatUser1: DMChatUserModel
    dmChatUser2: DMChatUserModel
    chatMessages: ChatMessageModel[]
    mutedBy: string[]

    constructor(
        chatId: string,
        dmChatUser1: DMChatUserModel,
        dmChatUser2: DMChatUserModel,
        chatMessages: ChatMessageModel[],
        mutedBy: string[]
    ) {
        super()
        this.chatId = chatId
        this.dmChatUser1 = dmChatUser1
        this.dmChatUser2 = dmChatUser2
        this.chatMessages = chatMessages
        this.mutedBy = mutedBy
    }
}

export class DMChatUserModel extends BaseModel {
    username: string
    profileImage: string
    status: string

    constructor(username: string, profileImage: string, status: string) {
        super()
        this.username = username
        this.profileImage = profileImage
        this.status = status
    }
}

export default ChatModel
