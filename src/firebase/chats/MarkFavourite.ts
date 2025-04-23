import userModel from '../../models/user.model.ts'
import { Firestore, doc, setDoc } from 'firebase/firestore'
import { FirestoreCollections } from '../../constants/FireStoreCollections.ts'

class MarkFavourite {
    static markAsFavourite(
        firestore: Firestore,
        userModel: userModel,
        favourite: string,
        onSuccess: (done: boolean) => void
    ) {
        const favouriteList = [...userModel.favourites]
        let updatedFavourites
        if (favouriteList.includes(favourite)) {
            updatedFavourites = favouriteList.filter((f) => f !== favourite)
        } else {
            updatedFavourites = [...favouriteList, favourite]
        }

        const newUserModel = {
            ...userModel,
            favourites: updatedFavourites,
        }
        const docRef=  doc(firestore,FirestoreCollections.USERS_COLLECTION,userModel.username)

        setDoc(docRef,newUserModel,{ merge: true })
            .then(() => {
                onSuccess(true)
            })
            .catch(()=> {
                onSuccess(false)
            })
    }
}

export default MarkFavourite
