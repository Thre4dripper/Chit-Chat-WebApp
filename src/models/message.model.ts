import { Timestamp } from "firebase/firestore";
import BaseModel from './base.model.ts'

abstract class MessageModel extends BaseModel {
    id: string;
    text: string | null;
    image: string | null;
    sticker: number | null;
    time: Timestamp;
    seenBy: string[];

    constructor(
        id: string,
        text: string | null ,
        image: string | null ,
        sticker: number | null ,
        time: Timestamp,
        seenBy: string[]
    ) {
        super();
        this.id = id;
        this.text = text;
        this.image = image;
        this.sticker = sticker;
        this.time = time;
        this.seenBy = seenBy;
    }
}
export default MessageModel;
