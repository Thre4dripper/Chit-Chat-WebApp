import BaseModel from './base.model.ts'
import GroupMessageModel from './group.message.model.ts'
class GroupChatModel extends BaseModel {
    id: string
    name: string
    image: string | null
    members: GroupChatUserModel[]
    messages: GroupMessageModel[]
    mutedBy: string[]

    constructor(
        id: string,
        name: string,
        image: string | null,
        members: GroupChatUserModel[],
        messages: GroupMessageModel[],
        mutedBy: string[]
    ) {
        super()
        this.id = id
        this.name = name
        this.image = image
        this.members = members
        this.messages = messages
        this.mutedBy = mutedBy
    }
}

class GroupChatUserModel extends BaseModel {
    username: string
    profileImage: string

    constructor(username: string, profileImage: string) {
        super()
        this.username = username
        this.profileImage = profileImage
    }
}

export default GroupChatModel
