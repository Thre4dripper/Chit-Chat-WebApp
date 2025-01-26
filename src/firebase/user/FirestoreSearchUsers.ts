import { User } from 'firebase/auth'
import {
    Firestore,
    collection,
    endAt,
    getDocs,
    orderBy,
    query,
    startAt,
    where,
} from 'firebase/firestore'
import UserModel from '../../models/user.model'
import { FirestoreCollections } from '../../constants/FireStoreCollections'
import { UserConstants } from '../../constants/UserConstants'

class FirestoreSearchUsers {
    static searchUsers(
        firestore: Firestore,
        loggedInUser: User | null,
        SearchQuery: string,
        SearchResult: (userList: UserModel[]) => void
    ) {
        const users = collection(firestore, FirestoreCollections.USERS_COLLECTION)

        const userQuery = query(
            users,
            where(UserConstants.USERNAME, '!=', ''),
            orderBy(UserConstants.USERNAME),
            startAt(SearchQuery),
            endAt(SearchQuery + '\uf8ff')
        )
        getDocs(userQuery)
            .then((userQuerySnapshot) => {
                const userList: UserModel[] = []
                userQuerySnapshot.forEach((doc) => {
                    const user = doc.data() as UserModel
                    if (user.uid !== loggedInUser?.uid) {
                        userList.push(user)
                    }
                });
                console.log("userList In Firebase file", userList.length);
                SearchResult(userList);
            })
            .catch((error) => {
                console.error('Error searching users:', error)
                SearchResult([])
            })
    }
}
export default FirestoreSearchUsers
