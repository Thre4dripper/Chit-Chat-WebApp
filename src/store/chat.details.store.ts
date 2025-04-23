import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import ChatModel from '../models/user.chat.model.ts'
import UserChatsRepository from '../repositories/user.chats.repository.ts'
import userModel from '../models/user.model.ts'
// import UserModel from '../models/user.model.ts'

type chatDetailsState = {
    currentChatId: string | null
    chatDetails: ChatModel | null
}
type chatDetailsActions = {
    updateSeen: (chat: ChatModel | null) => void
    setChatDetails: (chatId: string) => void
    sendTextMessage: (chatModel: ChatModel, text: string, from: string, to: string) => void
    sendStickerMessage:(chatModel:ChatModel,stickerIndex:number,from:string,to:string)=>void
    sendImageMessage:(ChatModel:ChatModel,image:string,from:string,to:string) => void
    setCurrentChatId: (chatId: string) => void
    favouriteChat:(userModel:userModel,favourite:string,onSuccess:(done:boolean)=>void) => void
    clearChat:(chatModel:ChatModel,success:(check:boolean)=>void) => void
    deleteChat:(chatModel: ChatModel,success:(check:boolean)=>void)=>void

}

const useChatDetailsStore = create<chatDetailsState & chatDetailsActions>()(
    devtools(
        immer((set) => ({
            currentChatId: null,
            chatDetails: null,
            updateSeen: (chat) => {
                UserChatsRepository.updateSeen(chat)
            },
            setChatDetails: (chatId) => {
                UserChatsRepository.getLiveUserChatById(chatId, (chat) => {
                    set((state) => {
                        // Ensure that updates only happen for the active chat
                        if (state.currentChatId === chatId) {
                            state.updateSeen(chat)
                            state.chatDetails = chat
                        }
                    })
                })
            },
            setCurrentChatId: (chatId) => {
                set({ currentChatId: chatId })
                useChatDetailsStore.getState().setChatDetails(chatId)
            },
            sendTextMessage: (chatModel, text, from, to) => {
                UserChatsRepository.sendTextMessage(chatModel, text, from, to, (id) => {
                    console.log('message sent', id);
                })
            },
            sendStickerMessage:(chatModel, stickerIndex, from, to)=>{
                UserChatsRepository.sendSticker(chatModel,stickerIndex,from,to,(id)=>{
                    console.log('sticker send',id);
                })
            },
            sendImageMessage:(chatModel:ChatModel,image:string,from:string,to)=>{
                UserChatsRepository.sendImage(chatModel,image,from,to,(id)=>{
                    console.log('message sent', id);
                })
            },
            favouriteChat(userModel:userModel,favourite:string,onSuccess:(done:boolean)=>void){
                UserChatsRepository.favouriteChat(userModel,favourite,onSuccess)

            },
            clearChat(chatModel:ChatModel,onSuccess:(done:boolean) => void) {
                UserChatsRepository.clearChat(chatModel, onSuccess)
            },
            deleteChat(chatModel,onSuccess) {
                UserChatsRepository.deleteChat(chatModel,onSuccess)
            }
        }))
    )
)
export default useChatDetailsStore
