import { getFirestore, doc, updateDoc } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'
import { FirestoreCollections } from '../../constants/FireStoreCollections.ts'
import { GroupConstants } from '../../constants/GroupConstants.ts'
import StorageUtils from '../../utils/StorageUtils.ts'
import { StorageFolders } from '../../constants/StorageFolders.ts'

// Mirrors UpdateGroup.kt + GroupsRepository.updateGroupImage() in Android

class UpdateGroup {
    static updateGroupImage(
        groupId: string,
        image: File,
        callback: (success: boolean) => void
    ) {
        const storage = getStorage()
        const path = `${StorageFolders.GROUP_IMAGES_FOLDER}/${groupId}`
        StorageUtils.getUrlFromStorage(storage, path, image, (url) => {
            if (!url) {
                callback(false)
                return
            }
            const firestore = getFirestore()
            const groupRef = doc(firestore, FirestoreCollections.GROUPS_COLLECTION, groupId)
            updateDoc(groupRef, { [GroupConstants.GROUP_IMAGE]: url })
                .then(() => callback(true))
                .catch(() => callback(false))
        })
    }
}

export default UpdateGroup
