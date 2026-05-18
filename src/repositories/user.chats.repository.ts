import { getFirestore } from 'firebase/firestore'
import firebaseApp from '../firebase/FirebaseInit.ts'
import GetChats from '../firebase/chats/GetChats.ts'
import useHomeChatsStore from '../store/home.chats.store.ts'
import useLocalStore from '../store/local.store.ts'
import { ChatType } from '../enums/ChatType.ts'
import ChatModel from '../models/user.chat.model.ts'
import HomeChatModel from '../models/home.chat.model.ts'
import SendChat from '../firebase/chats/SendChat.ts'
import UpdateSeen from '../firebase/chats/UpdateSeen.ts'
import { getStorage } from 'firebase/storage'
import DeleteChat from '../firebase/chats/DeleteChat.ts'
import { ChatMessageType } from '../enums/ChatMessageType.ts'
import ClearChat from '../firebase/chats/ClearChat.ts'
import UserModel from '../models/user.model.ts'
import MarkFavourite from '../firebase/chats/MarkFavourite.ts'
import userModel from '../models/user.model.ts'
import StorageUtils from '../utils/StorageUtils.ts'
import { StorageFolders } from '../constants/StorageFolders.ts'

class UserChatsRepository {
    static getAllUserChats() {
        const firestore = getFirestore(firebaseApp)
        const loggedInUser = useLocalStore.getState().username

        // looks like we have to put this here to save an api call and also to avoid indeterministic behavior
        if (!loggedInUser) {
            return
        }

        GetChats.getAllUserChats(firestore, loggedInUser, (userChats) => {
            const oldList = useHomeChatsStore
                .getState()
                .homeChats.filter((item) => item.type !== ChatType.USER)

            const newChats = userChats.map(
                (chat) =>
                    new HomeChatModel(
                        chat.chatId,
                        ChatType.USER,
                        chat,
                        null,
                        chat.chatMessages[0]?.time
                    )
            )
            const newList = [...oldList, ...newChats]

            newList.sort((a, b) => {
                return b.lastMessageTimestamp.toMillis() - a.lastMessageTimestamp.toMillis()
            })
            useHomeChatsStore.setState({ homeChats: newList })
        })
    }

    static getUserChatById(chatId: string, onSuccess: (chat: ChatModel | null) => void) {
        const firestore = getFirestore(firebaseApp)
        GetChats.getUserChatById(firestore, chatId, onSuccess)
    }

    static getLiveUserChatById(chatId: string, chatModel: (chatModel: ChatModel | null) => void) {
        const firestore = getFirestore(firebaseApp)
        GetChats.getLiveUserChatById(firestore, chatId, chatModel)
    }

    static sendTextMessage(
        chatModel: ChatModel,
        text: string,
        from: string,
        to: string,
        chatMessageId: (id: string | null) => void
    ) {
        const firestore = getFirestore(firebaseApp)
        SendChat.sendTextMessage(chatModel, firestore, text, from, to, chatMessageId)
    }

    static sendImage(
        chatModel: ChatModel,
        image: File,
        from: string,
        to: string,
        chatMessageId: (id: string | null) => void
    ) {
        const firestore = getFirestore(firebaseApp)
        const storage = getStorage(firebaseApp)
        const imagePath = `${StorageFolders.CHAT_IMAGES_FOLDER}/${chatModel.chatId}/${image.name}`

        StorageUtils.getUrlFromStorage(storage, imagePath, image, (imageUrl) => {
            if (!imageUrl) {
                chatMessageId(null)
                return
            }
            SendChat.SendImage(firestore, chatModel, imageUrl, from, to, chatMessageId)
        })
    }

    static sendSticker(
        chatModel: ChatModel,
        stickerIndex: number,
        from: string,
        to: string,
        chatMessageId: (id: string | null) => void
    ) {
        const firestore = getFirestore(firebaseApp)
        SendChat.SendSticker(firestore, chatModel, stickerIndex, from, to, chatMessageId)
    }

    static updateSeen(chatModel: ChatModel | null) {
        const firestore = getFirestore(firebaseApp)
        const loggedInUser = useLocalStore.getState().username
        if (!loggedInUser || !chatModel) {
            return
        }
        const onSuccess = (check: boolean) => {
            console.log('seen updated', check)
        }
        UpdateSeen.updateSeen(firestore, chatModel, loggedInUser, onSuccess)
    }
    static favouriteChat(userModel:UserModel,favourite:string,onSuccess:(newUserModel:userModel|null) => void) {
        const firestore = getFirestore(firebaseApp)
        MarkFavourite.markAsFavourite(firestore, userModel, favourite, onSuccess)
    }

    static clearChat(chatModel: ChatModel, onSuccess: (done: boolean) => void) {
        const firestore = getFirestore(firebaseApp)
        const storage = getStorage()
        ClearChat.clearUserChat(firestore, chatModel, (success: boolean) => {
            if (!success) {
                onSuccess(false)
                return
            }
            const hasImages = chatModel.chatMessages.some(
                (chatMessage) => chatMessage.type === ChatMessageType.TypeImage
            )
            if (hasImages) {
                ClearChat.clearChatImages(storage, chatModel, (isDeleted) => {
                    onSuccess(isDeleted)
                })
            } else {
                onSuccess(true)
            }
        })
    }

    static deleteChat(chatModel: ChatModel, onSuccess: (done: boolean) => void) {
        const firestore = getFirestore(firebaseApp)
        const storage = getStorage()
        DeleteChat.deleteUserChat(firestore, chatModel, (success) => {
            if (!success) {
                onSuccess(false)
                return
            }
            const hasImages = chatModel.chatMessages.some(
                (chatMessage) => chatMessage.type === ChatMessageType.TypeImage
            )
            if (!hasImages) {
                onSuccess(true)
                return
            }
            ClearChat.clearChatImages(storage, chatModel, (isImagesDeleted) => {
                onSuccess(isImagesDeleted)
            })
        })
    }
}

export default UserChatsRepository
