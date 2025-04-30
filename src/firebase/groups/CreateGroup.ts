import { Firestore, Timestamp, doc, setDoc } from 'firebase/firestore'
import { GroupChatUserModel } from '../../models/group.chat.model.ts'
import GroupChatModel from '../../models/group.chat.model.ts'
import GroupMessageModel from '../../models/group.message.model.ts'
import { FirestoreCollections } from '../../constants/FireStoreCollections.ts'
import { v4 as uuid } from 'uuid'
import { GroupMessageType } from '../../enums/GroupMessageType.ts'
import GetDetails from '../user/GetDetails.ts'
import UserModel from '../../models/user.model.ts'

class CreateGroup {
    static createNewGroup(
        firestore: Firestore,
        groupChatId: string,
        groupName: string,
        groupImageUrl: string | null,
        loggedInUsername: string,
        selectedUsers: GroupChatUserModel[],
        onSuccess: (done: string|null) => void
    ) {
        const group = new GroupChatModel(
            groupChatId,
            groupName,
            groupImageUrl,
            selectedUsers,
            [
                new GroupMessageModel(
                    uuid(),
                    GroupMessageType.TypeCreatedGroup,
                    null,
                    null,
                    null,
                    Timestamp.now(),
                    [loggedInUsername],
                    loggedInUsername
                ).toObject(),
            ],
            []
        )

        //add in groups collection

        const docRef = doc(firestore, FirestoreCollections.GROUPS_COLLECTION, groupChatId)
        setDoc(docRef, group.toObject())
            .then(() => {

            })
            .catch(() => {
                onSuccess(null)
            })

        //add in users collection
        selectedUsers.forEach((user) => {
            GetDetails.getUserDetails(firestore, user.username, (find) => {
                if (find) {
                    const docRef = doc(
                        firestore,
                        FirestoreCollections.USERS_COLLECTION,
                        user.username
                    )
                    setDoc(
                        docRef,
                        { ...find, groups: [...find.groups, groupChatId] } as UserModel,
                        { merge: true }
                    )
                        .then(() => {
                            onSuccess(groupChatId)
                        })
                        .catch(() => {
                            onSuccess(null)
                        })
                }
            })
        })
    }
}

export default CreateGroup
