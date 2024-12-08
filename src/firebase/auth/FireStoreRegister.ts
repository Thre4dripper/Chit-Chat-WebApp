import { Firestore, doc, setDoc, getDoc } from 'firebase/firestore'
import { User } from 'firebase/auth'
import { UserData } from '../../contexts/UserContext'

class FireStoreRegister {
    static async registerInitialUser(firestore: Firestore, user: User) {
        try {
            const userDocRef = doc(firestore, 'Users', user.uid)
            const userSnapshot = await getDoc(userDocRef)

            if (userSnapshot.exists()) {
                console.log('User already exists', userSnapshot.data() as UserData)
                return userSnapshot.data() as UserData
            }

            const userData: UserData = {
                uid: user.uid,
                bio: '',
                name: user.displayName || '',
                profileImage: user.photoURL || '',
                status: 'Online',
                favourites: [],
                fcmToken: '',
                groups: [],
                username: '',
            }

            await setDoc(userDocRef, userData)

            return userData as UserData
        } catch (error) {
            console.error('Error registering user:', error)
            return null
        }
    }
}

export default FireStoreRegister
