import { doc, Firestore, getDoc } from 'firebase/firestore'
import { User } from 'firebase/auth'
import { FirestoreCollections } from '../constants/FireStoreCollections.ts'

class Utils {
    /**
     * Function to Check if the user is already initially registered as an uid document in firestore
     */
    static async checkInitialRegistration(firestore: Firestore, user: User | null) {
        if (!user) {
            return false
        }

        const docRef = doc(firestore, FirestoreCollections.USERS_COLLECTION, user.uid)
        const docSnap = await getDoc(docRef)
        return docSnap.exists()
    }

    /**
     * Function to Check if the user is already completely registered as a username document in firestore
     */
    static async checkCompleteRegistration(firestore: Firestore, user: User | null) {
        if (!user) {
            return false
        }

        const docRef = doc(firestore, FirestoreCollections.REGISTERED_IDS_COLLECTION, user.uid)
        const docSnap = await getDoc(docRef)
        return docSnap.exists()
    }

    /**
     * Function to Check if the username is available in firestore
     */
    static async checkAvailableUsername(firestore: Firestore, username: string) {
        const docRef = doc(firestore, FirestoreCollections.USERS_COLLECTION, username)
        const docSnap = await getDoc(docRef)
        return !docSnap.exists()
    }
}

export default Utils
