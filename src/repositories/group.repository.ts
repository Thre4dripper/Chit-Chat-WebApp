import ChatModel from '../models/user.chat.model.ts'
import { getFirestore,doc,collection } from 'firebase/firestore'
import firebaseApp from '../firebase/FirebaseInit.ts'
import { getStorage } from 'firebase/storage'
import { FirestoreCollections } from '../constants/FireStoreCollections.ts'
import ChatUtils from '../utils/ChatUtils.ts'
import { GroupChatUserModel } from '../models/group.chat.model.ts'
import useHomeStore from '../store/home.store.ts'
import CreateGroup from '../firebase/groups/CreateGroup.ts'
import StorageUtils from '../utils/StorageUtils.ts'
import { StorageFolders } from '../constants/StorageFolders.ts'

class GroupsRepository{
    static createGroup(
        groupName: string,
        groupImageUri: File|null,
        selectedUsers: ChatModel[],
        onSuccess: (Success:string|null) =>void){
        const fireStore=getFirestore(firebaseApp)
        const storage= getStorage(firebaseApp)
        const loggedInUser= useHomeStore.getState().user
        if(!loggedInUser) {
            onSuccess(null)
            return
        }

        // following android code
        const groupRef = doc(collection(fireStore,FirestoreCollections.GROUPS_COLLECTION));
        const groupId = groupRef.id;

        const selectedGroupUsers = selectedUsers.map((chat)=> {
            const username = ChatUtils.getUserChatUsername(chat, loggedInUser.username)
            const profileImage = ChatUtils.getUserChatProfileImage(chat, loggedInUser.username)

            return new GroupChatUserModel(username, profileImage)
        })

        selectedGroupUsers.unshift(new GroupChatUserModel(loggedInUser?.username,loggedInUser?.profileImage))

        if (groupImageUri == null) {
            CreateGroup.createNewGroup(
                fireStore,
                groupId,
                groupName,
                null,
                loggedInUser.username,
                selectedGroupUsers,
                onSuccess,
            )
            return
        }
        StorageUtils.getUrlFromStorage(storage,`${StorageFolders.GROUP_IMAGES_FOLDER}/${groupId}`,groupImageUri,(imageUrl)=>{
            CreateGroup.createNewGroup(
                fireStore,
                groupId,
                groupName,
                imageUrl,
                loggedInUser.username,
                selectedGroupUsers,
                onSuccess,
            )
        })


    }
}

export default GroupsRepository