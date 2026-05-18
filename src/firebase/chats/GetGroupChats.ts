import {
    collection,
    Firestore,
    onSnapshot,
    doc,
    getDoc,
    where,
    query,
    documentId,
} from 'firebase/firestore'
import GroupChatModel from '../../models/group.chat.model.ts'
import { FirestoreCollections } from '../../constants/FireStoreCollections.ts'

class GetGroupChats {
    static getAllGroupChats(
        firestore: Firestore,
        loggedInUsername: string,
        onSuccess: (listOfGroup: GroupChatModel[]) => void
    ) {
        // Listen to the user document in real-time so that when new groups are added
        // (e.g. after createGroup), the home list updates automatically.
        // Both Android and web maintain user.groups, so this is cross-platform compatible.
        const userRef = doc(firestore, FirestoreCollections.USERS_COLLECTION, loggedInUsername)
        let innerUnsub: (() => void) | null = null

        onSnapshot(userRef, (userSnap) => {
            // Clean up the previous group-query listener before creating a new one
            if (innerUnsub) {
                innerUnsub()
                innerUnsub = null
            }

            if (!userSnap.exists()) {
                onSuccess([])
                return
            }

            const groupIds: string[] = userSnap.data()?.groups ?? []
            if (groupIds.length === 0) {
                onSuccess([])
                return
            }

            const groupCollection = collection(firestore, FirestoreCollections.GROUPS_COLLECTION)
            innerUnsub = onSnapshot(
                query(groupCollection, where(documentId(), 'in', groupIds)),
                (snap) => {
                    const groupChats: GroupChatModel[] = snap.docs.map(
                        (d) => d.data() as GroupChatModel
                    )
                    onSuccess(groupChats)
                },
                (error) => {
                    console.error('Issue in getting group chats', error)
                    onSuccess([])
                }
            )
        })
    }

    static getGroupChatById(
        firestore: Firestore,
        groupId: string,
        onSuccess: (groupModel: GroupChatModel | null) => void
    ) {
        const GroupRef = doc(firestore, FirestoreCollections.GROUPS_COLLECTION, groupId)

        getDoc(GroupRef).then((doc) => {
            if (doc.exists()) {
                onSuccess(doc.data() as GroupChatModel)
            } else {
                onSuccess(null)
            }
        })
    }

    static getLiveGroupChatById(
        firestore: Firestore,
        groupId: string,
        onSuccess: (liveGroupChat: GroupChatModel | null) => void
    ) {
        const GroupRef = doc(firestore, FirestoreCollections.GROUPS_COLLECTION, groupId)

        onSnapshot(
            GroupRef,
            (doc) => {
                if (doc.exists()) {
                    onSuccess(doc.data() as GroupChatModel)
                } else {
                    onSuccess(null)
                }
            },
            (error) => {
                console.error('Issue in getting live groupChatById', error)
                onSuccess(null)
            }
        )
    }
}

export default GetGroupChats
