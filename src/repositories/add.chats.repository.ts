import FirestoreSearchUsers from '../firebase/user/FirestoreSearchUsers'
import { getFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'
import UserModel from '../models/user.model'
class AddChatsRepository {
    static searchUsers = (searchQuery: string, set: any) => {
        const firestore = getFirestore()
        const loggedInUser = getAuth().currentUser
        FirestoreSearchUsers.searchUsers(
            firestore,
            loggedInUser,
            searchQuery,
            (userList: UserModel[]) => {
                set((state: any) => {
                    state.searchedUsers = userList
                })
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
