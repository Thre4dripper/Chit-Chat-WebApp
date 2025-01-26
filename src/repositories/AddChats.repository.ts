import FirestoreSearchUsers from '../firebase/user/FirestoreSearchUsers'
import { getFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'
import UserModel from '../models/user.model'
import MutableLiveDataStore from '../store/MutableLiveData.store'
class AddChatsRepository {
    static searchUsers = (searchQuery: string) => {
        const firestore = getFirestore()
        const loggedInUser = getAuth().currentUser
        if (!loggedInUser) {
            //  user is not logged in Threaddripper will handle this
            return
        }
        FirestoreSearchUsers.searchUsers(
            firestore,
            loggedInUser,
            searchQuery,
            (userList: UserModel[]) => {
                const setSearchResult = MutableLiveDataStore.getState().setSearchResult
                setSearchResult(userList)
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
