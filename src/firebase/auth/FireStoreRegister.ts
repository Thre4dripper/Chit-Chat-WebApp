import { User } from 'firebase/auth'
import { FirestoreCollections } from '../../constants/FireStoreCollections.ts'
import Utils from '../../utils/Utils.ts'
import UserModel from '../../models/user.model.ts'
import { UserStatus } from '../../enums/UserStatus.ts'
import { doc, setDoc, Firestore } from 'firebase/firestore'

class FireStoreRegister {
    static registerInitialUser(
        firestore: Firestore,
        user: User,
        onSuccess: (isSuccess: boolean) => void
    ) {
        Utils.checkInitialRegistration(firestore, user, (isSuccess) => {
            if (isSuccess) {
                onSuccess(true)
                return
            }

            const data = new UserModel(
                user.uid,
                '',
                user.displayName!,
                user.photoURL!,
                '',
                UserStatus.Online,
                [],
                '',
                []
            ).toObject()

            const userDocRef = doc(firestore, FirestoreCollections.USERS_COLLECTION, user.uid)
            setDoc(userDocRef, data)
                .then(() => {
                    onSuccess(true)
                })
                .catch((error) => {
                    console.error('Error adding document:', error)
                    onSuccess(false)
                })
        })
    }
}

export default FireStoreRegister
