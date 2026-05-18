import HomeChatModel from '../models/home.chat.model.ts'
import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import UserChatsRepository from '../repositories/user.chats.repository.ts'
import addChatsRepository from '../repositories/add.chats.repository.ts'
import UserModel from '../models/user.model.ts'
import useChatDetailsStore from './chat.details.store.ts'
import GroupChatsRepository from '../repositories/group.chats.repository.ts'
import { ChatType } from '../enums/ChatType.ts'
type homeChatState = {
    homeChats: HomeChatModel[]
}
type homeChatActions = {
    setHomeChats: () => void
    startChat: (newChatUser: UserModel) => void
}

const useHomeChatsStore = create<homeChatState & homeChatActions>()(
    devtools(
        immer((set) => ({
            homeChats: [],
            setHomeChats: () => {
                UserChatsRepository.getAllUserChats()
                GroupChatsRepository.getAllGroupChats()
            },
            startChat: (newChatUser: UserModel) => {
                addChatsRepository.addChat(newChatUser, (chatId) => {
                    if (!chatId) {
                        console.log(set)
                        return
                    }
                    useChatDetailsStore.getState().setCurrentChatId(chatId, ChatType.USER)
                })
            },
        }))
    )
)
export default useHomeChatsStore
