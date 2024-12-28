import { getFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'
import GetProfile from '../firebase/profile/GetProfile.ts'
import useLocalStore from '../store/local.store.ts'
import useUserStore from '../store/user.store.ts'

class UserRepository {
    static getUserDetails(onSuccess: (isSuccess: boolean) => void) {
        const firestore = getFirestore()
        const auth = getAuth()
        const user = auth.currentUser
        const username = useLocalStore.getState().username

        GetProfile.getProfile(firestore, user, username, (profile) => {
            if (profile) {
                useUserStore.setState({ user: profile })
                onSuccess(true)
            } else {
                useUserStore.setState({ user: null })
                onSuccess(false)
            }
        })
    }
}

export default UserRepository
