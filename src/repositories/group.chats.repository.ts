import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'
import firebaseApp from '../firebase/FirebaseInit.ts'
import useLocalStore from '../store/local.store.ts'
import GroupChatModel from '../models/group.chat.model.ts'
import GetGroupChats from '../firebase/chats/GetGroupChats.ts'
import SendGroupChat from '../firebase/chats/SendGroupChat.ts'
import UpdateSeen from '../firebase/chats/UpdateSeen.ts'
import ExitGroup from '../firebase/groups/ExitGroup.ts'
import StorageUtils from '../utils/StorageUtils.ts'
import { StorageFolders } from '../constants/StorageFolders.ts'
import useHomeChatsStore from '../store/home.chats.store.ts'
import { ChatType } from '../enums/ChatType.ts'
import homeChatModel from '../models/home.chat.model.ts'
import { v4 as uuid } from 'uuid'
import MuteGroup from '../firebase/groups/MuteGroup.ts'

class GroupChatsRepository {
    static getAllGroupChats() {
        const firestore = getFirestore(firebaseApp)
        const loggedInUsername = useLocalStore.getState().username
        if (!loggedInUsername) return
        GetGroupChats.getAllGroupChats(firestore, loggedInUsername, (groupChats) => {
            const oldList = useHomeChatsStore
                .getState()
                .homeChats.filter((item) => item.type !== ChatType.GROUP)
            const newChats = groupChats.map(
                (chat) =>
                    new homeChatModel(chat.id, ChatType.GROUP, null, chat, chat.messages[0]?.time)
            )
            const newList = [...oldList, ...newChats]
            newList.sort((a, b) => {
                return b.lastMessageTimestamp.toMillis() - a.lastMessageTimestamp.toMillis()
            })
            useHomeChatsStore.setState({ homeChats: newList })
        })
    }

    static getLiveGroupChatById(
        chatId: string,
        chatModel: (GroupChatModel: GroupChatModel | null) => void
    ) {
        const firestore = getFirestore(firebaseApp)
        GetGroupChats.getLiveGroupChatById(firestore, chatId, chatModel)
    }

    static sendGroupTextMessage(
        groupChatModel: GroupChatModel,
        text: string,
        from: string,
        chatMessageId: (id: string | null) => void
    ) {
        const firestore = getFirestore(firebaseApp)
        SendGroupChat.sendTextMessage(firestore, groupChatModel, text, from, chatMessageId)
    }

    static sendGroupSticker(
        groupChatModel: GroupChatModel,
        stickerIndex: number,
        from: string,
        chatMessageId: (id: string | null) => void
    ) {
        const firestore = getFirestore(firebaseApp)
        SendGroupChat.sendSticker(firestore, groupChatModel, stickerIndex, from, chatMessageId)
    }

    static sendGroupImage(
        groupChatModel: GroupChatModel,
        image: File,
        from: string,
        chatMessageId: (id: string | null) => void
    ) {
        const firestore = getFirestore(firebaseApp)
        const storage = getStorage(firebaseApp)
        const imagePath = `${StorageFolders.CHAT_IMAGES_FOLDER}/${groupChatModel.id}/${uuid()}`

        StorageUtils.getUrlFromStorage(storage, imagePath, image, (imageUrl) => {
            if (!imageUrl) {
                chatMessageId(null)
                return
            }
            SendGroupChat.sendImage(firestore, groupChatModel, imageUrl, from, chatMessageId)
        })
    }

    static updateGroupSeen(groupChatModel: GroupChatModel | null) {
        const firestore = getFirestore(firebaseApp)
        const loggedInUser = useLocalStore.getState().username
        if (!loggedInUser || !groupChatModel) return
        UpdateSeen.updateGroupSeen(firestore, groupChatModel, loggedInUser, (success) => {
            console.log('group seen updated', success)
        })
    }

    static exitGroup(
        groupChatModel: GroupChatModel,
        username: string,
        onSuccess: (success: boolean) => void
    ) {
        const firestore = getFirestore(firebaseApp)
        ExitGroup.exitGroup(firestore, groupChatModel, username, onSuccess)
    }

    static muteUnMuteGroupChat(
        groupChat: GroupChatModel,
        username: string,
        isMute: boolean,
        onSuccess: (success: boolean) => void
    ) {
        const firestore = getFirestore(firebaseApp)
        MuteGroup.muteUnMuteGroupChat(firestore, groupChat, username, isMute, onSuccess)
    }
}

export default GroupChatsRepository
