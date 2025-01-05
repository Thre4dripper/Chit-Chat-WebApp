import { getFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'
import GetProfile from '../firebase/profile/GetProfile.ts'
import useLocalStore from '../store/local.store.ts'
import useHomeStore from '../store/home.store.ts'
import Utils from '../utils/Utils.ts'
import FireStoreRegister from '../firebase/auth/FireStoreRegister.ts'
import UpdateProfile from '../firebase/profile/UpdateProfile.ts'

class UserRepository {
    static getUserDetails(onSuccess: (isSuccess: boolean) => void) {
        const firestore = getFirestore()
        const auth = getAuth()
        const user = auth.currentUser
        const username = useLocalStore.getState().username

        GetProfile.getProfile(firestore, user, username, (profile) => {
            if (profile) {
                useHomeStore.setState({ user: profile })
                onSuccess(true)
            } else {
                useHomeStore.setState({ user: null })
                onSuccess(false)
            }
        })
    }

    static updateUsernames(username: string, callback: (updatedUsername: string) => void) {
        const firestore = getFirestore()
        const auth = getAuth()
        const user = auth.currentUser

        Utils.checkCompleteRegistration(firestore, user, (isComplete) => {
            if (!isComplete) {
                FireStoreRegister.registerCompleteUser(
                    firestore,
                    user,
                    username,
                    (updatedUsername) => {
                        // update in user state
                        const user = useHomeStore.getState().user
                        if (user) {
                            user.username = updatedUsername
                            useHomeStore.setState({ user })
                        }
                        callback(updatedUsername)
                    }
                )
                return
            }

            const prevUsername = useHomeStore.getState().user?.username || null
            UpdateProfile.UpdateUsername(
                firestore,
                user!,
                prevUsername,
                username,
                (updatedUsername) => {
                    // update in user state
                    const user = useHomeStore.getState().user
                    if (user) {
                        user.username = updatedUsername
                        useHomeStore.setState({ user })
                    }
                    callback(updatedUsername)
                }
            )
        })
    }
}

export default UserRepository
