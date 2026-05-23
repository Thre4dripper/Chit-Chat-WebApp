import { arrayRemove, deleteDoc, doc, Firestore, setDoc, updateDoc } from 'firebase/firestore'
import { deleteObject, getStorage, listAll, ref } from 'firebase/storage'
import GroupChatModel from '../../models/group.chat.model.ts'
import GroupMessageModel from '../../models/group.message.model.ts'
import { FirestoreCollections } from '../../constants/FireStoreCollections.ts'
import { GroupMessageType } from '../../enums/GroupMessageType.ts'
import { StorageFolders } from '../../constants/StorageFolders.ts'
import { Timestamp } from 'firebase/firestore'
import { v4 as uuid } from 'uuid'

class ExitGroup {
    static async exitGroup(
        firestore: Firestore,
        groupChatModel: GroupChatModel,
        username: string,
        onSuccess: (success: boolean) => void
    ) {
        try {
            const groupRef = doc(
                firestore,
                FirestoreCollections.GROUPS_COLLECTION,
                groupChatModel.id
            )

            // Remove from members (mirrors Android ExitGroup.exitFromGroup)
            const newMembers = groupChatModel.members
                .filter((m) => m.username !== username)
                .map((m) => ({ username: m.username, profileImage: m.profileImage }))

            // Add TypeLeavedMember message at index 0 (mirrors Android ExitGroup.exitFromGroup)
            const leavedMessage = new GroupMessageModel(
                uuid(),
                GroupMessageType.TypeLeavedMember,
                null,
                null,
                null,
                Timestamp.now(),
                [username],
                username
            ).toObject()
            const newMessages = [leavedMessage, ...groupChatModel.messages]

            // Remove from mutedBy (mirrors Android ExitGroup.exitFromGroup)
            const newMutedBy = (groupChatModel.mutedBy ?? []).filter((u) => u !== username)

            await setDoc(
                groupRef,
                { members: newMembers, messages: newMessages, mutedBy: newMutedBy },
                { merge: true }
            )

            // Remove groupId from user's groups array (mirrors Android RemoveGroup.removeFromUserCollection)
            const userRef = doc(firestore, FirestoreCollections.USERS_COLLECTION, username)
            await updateDoc(userRef, { groups: arrayRemove(groupChatModel.id) })

            // If group has no members left, delete the group (mirrors Android GroupsRepository.exitGroup)
            if (newMembers.length === 0) {
                await deleteDoc(groupRef)
                // Best-effort storage cleanup — don't block success if paths don't exist
                try {
                    const storage = getStorage()
                    const deleteFolder = async (path: string) => {
                        const folderRef = ref(storage, path)
                        const result = await listAll(folderRef)
                        await Promise.all(result.items.map((item) => deleteObject(item)))
                    }
                    await deleteFolder(`${StorageFolders.GROUP_IMAGES_FOLDER}/${groupChatModel.id}/`)
                    const hasImages = groupChatModel.messages.some(
                        (m) => m.type === GroupMessageType.TypeImage
                    )
                    if (hasImages) {
                        await deleteFolder(`${StorageFolders.CHAT_IMAGES_FOLDER}/${groupChatModel.id}/`)
                    }
                } catch {
                    // Storage paths may not exist; Firestore deletion already succeeded
                }
            }

            onSuccess(true)
        } catch (error) {
            console.error('Error exiting group:', error)
            onSuccess(false)
        }
    }
}

export default ExitGroup
