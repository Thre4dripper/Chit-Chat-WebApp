import BaseModel from './base.model.ts'
import { ChatMessageType } from '../enums/ChatMessageType.ts'
import { Timestamp } from '@firebase/firestore'
class ChatMessageModel extends BaseModel {
    id: string
    type: ChatMessageType
    text: string | null
    image: string | null
    sticker: number | null
    time: Timestamp
    seenBy: string[]
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
        super()
        this.id = id
        this.type = type
        this.text = text
        this.image = image
        this.sticker = sticker
        this.time = time
        this.seenBy = seenBy
        this.from = from
        this.to = to
    }
}

export default ChatMessageModel
