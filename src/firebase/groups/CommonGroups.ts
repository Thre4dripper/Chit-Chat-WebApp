import {
    collection,
    documentId,
    Firestore,
    getDoc,
    doc,
    onSnapshot,
    query,
    where,
} from 'firebase/firestore'
import GroupChatModel from '../../models/group.chat.model.ts'
import { FirestoreCollections } from '../../constants/FireStoreCollections.ts'

class CommonGroups {
    /**
     * Returns groups where both loggedInUsername and otherUsername are members.
     * Mirrors Android's ChatProfileActivity common groups feature.
     * Uses user.groups array as source of truth (cross-platform: both Android and web maintain it).
     */
    static getCommonGroups(
        firestore: Firestore,
        loggedInUsername: string,
        otherUsername: string,
        onSuccess: (groups: GroupChatModel[]) => void
    ) {
        const userRef = doc(firestore, FirestoreCollections.USERS_COLLECTION, loggedInUsername)
        getDoc(userRef).then((userSnap) => {
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
            onSnapshot(
                query(groupCollection, where(documentId(), 'in', groupIds)),
                (snapshot) => {
                    const commonGroups = snapshot.docs
                        .map((d) => d.data() as GroupChatModel)
                        .filter(
                            (group) =>
                                group.members?.some((m) => m.username === otherUsername) ?? false
                        )
                    onSuccess(commonGroups)
                },
                () => {
                    onSuccess([])
                }
            )
        })
    }
}

export default CommonGroups
