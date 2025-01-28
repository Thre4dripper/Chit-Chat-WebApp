import FirestoreSearchUsers from '../firebase/user/FirestoreSearchUsers'
import { getFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'
import UserModel from '../models/user.model'
import useAddChatsStore from '../store/add.chats.store.ts'

class AddChatsRepository {
    static searchUsers = (searchQuery: string) => {
        const firestore = getFirestore()
        const loggedInUser = getAuth().currentUser
        FirestoreSearchUsers.searchUsers(
            firestore,
            loggedInUser,
            searchQuery,
            (userList: UserModel[]) => {
                useAddChatsStore.setState({ searchedUsers: userList, isLoading: false })
            }
        )
    }
    //       static addChat = (
    //         newChatUser: UserModel,
    //         chatId:string
    //       ) => {
    //        const firestore = getFirestore();
    //        const currentUser = getAuth().currentUser;
    //          if (!currentUser) {
    //               //user is not logged in Threaddripper will handle this
    //               return;
    //          }
    //          Add
    // }
}

export default AddChatsRepository
