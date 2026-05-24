import { getFirestore, collection, query, where, getDocs, or, and } from 'firebase/firestore'
import { FirestoreCollections } from '../../constants/FireStoreCollections.ts'
import { ChatConstants } from '../../constants/ChatConstants.ts'
import { UserConstants } from '../../constants/UserConstants.ts'

// Mirrors FindMemberChat.kt in Android — queries Firestore for an existing DM between two users

class FindMemberChat {
    static findChatId(
        loggedInUsername: string,
        memberUsername: string,
        onSuccess: (chatId: string | null) => void
    ) {
        const firestore = getFirestore()
        const chatsRef = collection(firestore, FirestoreCollections.CHATS_COLLECTION)
        const q = query(
            chatsRef,
            or(
                and(
                    where(
                        `${ChatConstants.DM_CHAT_USER_1}.${UserConstants.USERNAME}`,
                        '==',
                        loggedInUsername
                    ),
                    where(
                        `${ChatConstants.DM_CHAT_USER_2}.${UserConstants.USERNAME}`,
                        '==',
                        memberUsername
                    )
                ),
                and(
                    where(
                        `${ChatConstants.DM_CHAT_USER_1}.${UserConstants.USERNAME}`,
                        '==',
                        memberUsername
                    ),
                    where(
                        `${ChatConstants.DM_CHAT_USER_2}.${UserConstants.USERNAME}`,
                        '==',
                        loggedInUsername
                    )
                )
            )
        )
        getDocs(q)
            .then((snapshot) => {
                onSuccess(snapshot.empty ? null : snapshot.docs[0].id)
            })
            .catch(() => onSuccess(null))
    }
}

export default FindMemberChat
