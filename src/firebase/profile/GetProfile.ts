import { doc, Firestore, getDoc } from 'firebase/firestore'
import { User } from 'firebase/auth'
import UserModel from '../../models/user.model.ts'
import { FirestoreCollections } from '../../constants/FireStoreCollections.ts'

class GetProfile {
    static getProfile(
        firestore: Firestore,
        user: User,
        username: string,
        profile: (userModel: UserModel | null) => void
    ) {
        this.getProfileFromUsernameDoc(firestore, username, (userModel) => {
            if (userModel === null) {
                this.getProfileFromUidDoc(firestore, user.uid, (uidDocProfile) => {
                    profile(uidDocProfile)
                })
            } else {
                profile(userModel)
            }
        })
    }

    static getProfileFromUidDoc(
        firestore: Firestore,
        uid: string,
        profile: (userModel: UserModel | null) => void
    ) {
        const docRef = doc(firestore, FirestoreCollections.USERS_COLLECTION, uid)
        getDoc(docRef)
            .then((doc) => {
                if (doc.exists()) {
                    profile(doc.data() as UserModel)
                } else {
                    profile(null)
                }
            })
            .catch((error) => {
                console.error('Error getting document:', error)
                profile(null)
            })
    }

    private static getProfileFromUsernameDoc(
        firestore: Firestore,
        username: string,
        profile: (userModel: UserModel | null) => void
    ) {
        const docRef = doc(firestore, FirestoreCollections.USERS_COLLECTION, username)
        getDoc(docRef)
            .then((doc) => {
                if (doc.exists()) {
                    profile(doc.data() as UserModel)
                } else {
                    profile(null)
                }
            })
            .catch((error) => {
                console.error('Error getting document:', error)
                profile(null)
            })
    }
}

export default GetProfile
