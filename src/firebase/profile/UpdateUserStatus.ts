import { Firestore, doc, updateDoc } from 'firebase/firestore'
import { FirestoreCollections } from '../../constants/FireStoreCollections.ts'

/**
 * Update user status in Firestore.
 * Status can be: "Online" or "LastSeen<unixTimestampSeconds>"
 * Mirrors Android's StatusService functionality.
 */
class UpdateUserStatus {
    static setUserStatus(
        firestore: Firestore,
        username: string,
        status: string,
        onSuccess: (success: boolean) => void
    ) {
        try {
            const userRef = doc(firestore, FirestoreCollections.USERS_COLLECTION, username)

            updateDoc(userRef, {
                status: status,
            })
                .then(() => {
                    onSuccess(true)
                })
                .catch(() => {
                    onSuccess(false)
                })
        } catch (error) {
            console.error('Error updating user status:', error)
            onSuccess(false)
        }
    }

    /**
     * Set user status to "Online"
     */
    static setOnline(firestore: Firestore, username: string, onSuccess: (success: boolean) => void) {
        this.setUserStatus(firestore, username, 'Online', onSuccess)
    }

    /**
     * Set user status to "LastSeen<unixTimestampSeconds>"
     */
    static setLastSeen(
        firestore: Firestore,
        username: string,
        onSuccess: (success: boolean) => void
    ) {
        const unixTimestamp = Math.floor(Date.now() / 1000)
        this.setUserStatus(firestore, username, `LastSeen${unixTimestamp}`, onSuccess)
    }
}

export default UpdateUserStatus
