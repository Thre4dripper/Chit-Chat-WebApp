import { getMessaging } from 'firebase/messaging'
import firebaseApp from './FirebaseInit.ts'

const firebaseMessaging = getMessaging(firebaseApp)

export default firebaseMessaging
