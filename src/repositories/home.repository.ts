import Utils from '../utils/Utils.ts'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

class HomeRepository {
    static checkInitialRegistration(callback: (onSuccess: boolean) => void) {
        const firestore = getFirestore()
        const auth = getAuth()
        const user = auth.currentUser

        Utils.checkInitialRegistration(firestore, user, callback)
    }

    static checkCompleteRegistration(callback: (onSuccess: boolean) => void) {
        const firestore = getFirestore()
        const auth = getAuth()
        const user = auth.currentUser

        Utils.checkCompleteRegistration(firestore, user, callback)
    }
}

export default HomeRepository
