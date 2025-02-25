import MessageModel from './message.model.ts'
import { GroupMessageType } from '../enums/GroupMessageType.ts'
import { Timestamp } from '@firebase/firestore'

class GroupMessageModel extends MessageModel {

    type: GroupMessageType
    from: string

    constructor(
        id: string,
        type: GroupMessageType,
        text: string | null,
        image: string | null,
        sticker: number | null,
        time: Timestamp,
        seenBy: string[],
        from: string
    ) {
        super(id, text, image, sticker, time, seenBy)
        this.type = type
        this.from = from
    }
}

export default GroupMessageModel
