import { Firestore, doc, setDoc } from 'firebase/firestore'
import { User } from 'firebase/auth'
import { FirestoreCollections } from '../../constants/FireStoreCollections.ts'
import Utils from '../../utils/Utils.ts'
import UserModel from '../../models/UserModel.ts'
import { UserStatus } from '../../enums/UserStatus.ts'

class FireStoreRegister {
    static async registerInitialUser(firestore: Firestore, user: User): Promise<boolean> {
        try {
            const isUserRegistered = await Utils.checkCompleteRegistration(firestore, user)
            if (isUserRegistered) {
                return true
            }

            const userDocRef = doc(firestore, FirestoreCollections.USERS_COLLECTION, user.uid)
            const data = new UserModel(
                user.uid,
                '',
                user.displayName!,
                user.photoURL!,
                '',
                UserStatus[UserStatus.Online],
                [],
                '',
                []
            ).toObject()

            await setDoc(userDocRef, data)
            return true
        } catch (error) {
            console.error('Error registering user:', error)
            return false
        }
    }
}

export default FireStoreRegister
