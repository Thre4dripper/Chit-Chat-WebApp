import HomeChatModel from '../models/home.chat.model.ts'
import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import UserChatsRepository from '../repositories/user.chats.repository.ts'
import addChatsRepository from '../repositories/add.chats.repository.ts'
import UserModel from '../models/user.model.ts'
import useChatDetailsStore from './chat.details.store.ts'
// import useHomeStore from './home.store.ts'

type homeChatState = {
    homeChats: HomeChatModel[]
    // favouriteUsers:UserModel[]
}
type homeChatActions = {
    setHomeChats: () => void
    startChat: (dmUser: UserModel) => void
    // setFavouriteUsers:()=>void
}

const useHomeChatsStore = create<homeChatState & homeChatActions>()(
    devtools(
        immer((set) => ({
            homeChats: [],
            // favouriteUsers: [],
            setHomeChats: () => {
                UserChatsRepository.getAllUserChats()
            },
            // setFavouriteUsers: () => {
            //     const userModel=useHomeStore.getState().user
            //     if(!userModel)return
            //     const favUidList: string[] = userModel.favourites.map((combinedUid) => {
            //                     const uids = combinedUid.split('-');
            //                     return uids.find((uid) => uid !== userModel.uid)!;
            //                 });
            //     UserChatsRepository.getAllFavouriteProfiles(favUidList,(profiles)=>{
            //         console.log(profiles)
            //         set({ favouriteUsers: profiles })
            //     })
            // },
            startChat: (newChatUser: UserModel) => {
                addChatsRepository.addChat(newChatUser, (chatId) => {
                    if (!chatId) {
                        console.log(set)
                        return
                    }
                    useChatDetailsStore.getState().setCurrentChatId(chatId)
                    useChatDetailsStore.getState().setChatDetails(chatId)
                })
            },
        }))
    )
)
export default useHomeChatsStore
