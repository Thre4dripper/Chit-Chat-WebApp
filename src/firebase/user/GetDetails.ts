import { doc, getDoc, onSnapshot, Firestore } from 'firebase/firestore'
import UserModel from '../../models/user.model.ts'
import { FirestoreCollections } from '../../constants/FireStoreCollections.ts'

class GetDetails {
    static getLiveUserDetails(
        firestore: Firestore,
        username: string,
        onSuccess: (user: UserModel | null) => void
    ) {
        const userDocRef = doc(firestore, FirestoreCollections.USERS_COLLECTION, username)

        onSnapshot(
            userDocRef,
            (docSnapshot) => {
                if (docSnapshot.exists()) {
                    const data = docSnapshot.data() as UserModel
                    onSuccess(data)
                } else {
                    onSuccess(null)
                }
            },
            (error) => {
                console.error('Error fetching live user details:', error)
                onSuccess(null)
            }
        )
    }

    static async getUserDetails(
        firestore: Firestore,
        username: string,
        onSuccess: (user: UserModel | null) => void
    ) {
        const userDocRef = doc(firestore, FirestoreCollections.USERS_COLLECTION, username)

        getDoc(userDocRef)
            .then((doc) => {
                if (doc.exists()) {
                    onSuccess(doc.data() as UserModel)
                } else {
                    onSuccess(null)
                }
            })
            .catch((error) => {
                console.error(error)
                onSuccess(null)
            })
    }
}

export default GetDetails
