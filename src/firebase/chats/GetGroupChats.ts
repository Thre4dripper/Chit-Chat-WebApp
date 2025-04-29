import { collection, Firestore, onSnapshot, doc, getDoc ,where ,query } from 'firebase/firestore'
import GroupChatModel from '../../models/group.chat.model.ts'
import { FirestoreCollections } from '../../constants/FireStoreCollections.ts'
// import { GroupConstants } from '../../constants/GroupConstants.ts'

class GetGroupChats {
    static getAllGroupChats(
        firestore: Firestore,
        groupUser: {username: string,profileImage: string},
        onSuccess: (listOfGroup: GroupChatModel[]) => void
    ) {

        const GroupCollection = collection(firestore, FirestoreCollections.GROUPS_COLLECTION);
        const groupQuery = query(
            GroupCollection,
            where("members", 'array-contains', groupUser)
        );
        onSnapshot(
            groupQuery,
            (chatQuerySnapshot) => {
                const groupChats: GroupChatModel[] = [];
                chatQuerySnapshot.docs.forEach((doc) => {
                    const groupChat = doc.data() as GroupChatModel;
                    groupChats.push(groupChat);
                });
                onSuccess(groupChats);
            },
            (error) => {
                console.error("Issue in getting chats", error);
                onSuccess([]);
            }
        );
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
