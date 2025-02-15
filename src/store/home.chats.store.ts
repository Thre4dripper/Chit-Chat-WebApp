import HomeChatModel from '../models/home.chat.model.ts'
import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import ChatModel from '../models/user.chat.model.ts'
import UserChatsRepository from '../repositories/user.chats.repository.ts'
import addChatsRepository from '../repositories/add.chats.repository.ts'
import UserModel from '../models/user.model.ts'

type homeChatState = {
    homeChats: HomeChatModel[]
    _chatDetails: ChatModel | null
}
type homeChatActions = {
    setHomeChats: () => void
    setChatDetails: (chatId: string) => void
    dmChat: (dmUser:UserModel) => void
}

const useHomeChatsStore = create<homeChatState & homeChatActions & { unsubscribe?: () => void }>()(
    devtools(
        immer((set,get) => ({
            homeChats: [],
            _chatDetails: null,
            unsubscribe: undefined,
            setHomeChats: () => {
                UserChatsRepository.getAllUserChats()
            },
            dmChat: (newChatUser:UserModel) => {
                addChatsRepository.addChat(newChatUser,(chatId)=>{
                    if (!chatId) {
                        console.log('AddChat Repository')
                        return
                    }
                    UserChatsRepository.getUserChatById(chatId, (chat) => {
                        if (chat) {
                            set({ _chatDetails: chat })
                        }
                    })
                })

            },
            setChatDetails: (chatId) => {
                get().unsubscribe?.();
                set({ _chatDetails: null });
                const unsubscribe = UserChatsRepository.getLiveUserChatById(chatId, (chat) => {
                    set({ _chatDetails: chat });
                });
                set({ unsubscribe });
            },
        }))
    )
)
export default useHomeChatsStore
