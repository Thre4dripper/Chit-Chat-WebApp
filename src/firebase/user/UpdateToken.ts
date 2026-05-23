import { doc, Firestore, updateDoc } from 'firebase/firestore'
import { FirestoreCollections } from '../../constants/FireStoreCollections.ts'
import { UserConstants } from '../../constants/UserConstants.ts'

class UpdateToken {
    static updateFCMToken(firestore: Firestore, username: string, token: string) {
        const userDocRef = doc(firestore, FirestoreCollections.USERS_COLLECTION, username)
        updateDoc(userDocRef, { [UserConstants.FCM_TOKEN]: token }).catch((error) => {
            console.error('Error updating FCM token:', error)
        })
    }
}

export default UpdateToken
