import BaseModel from './base.model.ts'
import { GroupMessageType } from '../enums/GroupMessageType.ts'
import { Timestamp } from '@firebase/firestore'

class GroupMessageModel extends BaseModel {
    id: string
    type: GroupMessageType
    text: string | null
    image: string | null
    sticker: number | null
    time: Timestamp
    seenBy: string[]
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
        super()
        this.id = id
        this.type = type
        this.text = text
        this.image = image
        this.sticker = sticker
        this.time = time
        this.seenBy = seenBy
        this.from = from
    }
}

export default GroupMessageModel
