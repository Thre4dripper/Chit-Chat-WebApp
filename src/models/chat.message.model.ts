import MessageModel from './message.model.ts'
import { ChatMessageType } from '../enums/ChatMessageType.ts'
import { Timestamp } from '@firebase/firestore'

class ChatMessageModel extends MessageModel {
    type: ChatMessageType
    from: string
    to: string

    constructor(
        id: string,
        type: ChatMessageType,
        text: string | null,
        image: string | null,
        sticker: number | null,
        time: Timestamp,
        seenBy: string[],
        from: string,
        to: string
    ) {
        super(id, text, image, sticker, time, seenBy)
        this.type = type
        this.from = from
        this.to = to
    }
}

export default ChatMessageModel
