import FirestoreSearchUsers from '../firebase/user/FirestoreSearchUsers'
import { getFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'
import UserModel from '../models/user.model'
import useAddChatsStore from '../store/add.chats.store.ts'
import ChatUtils from '../utils/ChatUtils.ts'
import AddNewChat from '../firebase/chats/AddNewChat.ts'
import HomeStore from '../store/home.store.ts'

class AddChatsRepository {
    static searchUsers(searchQuery: string) {
        const firestore = getFirestore()
        const loggedInUser = getAuth().currentUser
        FirestoreSearchUsers.searchUsers(
            firestore,
            loggedInUser,
            searchQuery,
            (userList: UserModel[]) => {
                useAddChatsStore.getState().setSearchedUsers(userList)
            }
        )
    }
    static addChat(newChatUser: UserModel, chatId: (id: string | null) => void) {
        const firestore = getFirestore()
        const currentUser = HomeStore.getState().user
        if (!currentUser) {
            throw new Error('Current user is not available')
        }

        ChatUtils.checkIfUserChatExists(
            firestore,
            currentUser.uid,
            newChatUser.uid,
            (existingChatId) => {
                if (existingChatId) {
                    // If chat exists, return the existing chat ID
                    chatId(existingChatId)
                } else {
                    // If chat does not exist, add a new chat
                    AddNewChat.addNewChat(firestore, newChatUser, currentUser, chatId)
                }
            }
        )
    }
}

export default AddChatsRepository
