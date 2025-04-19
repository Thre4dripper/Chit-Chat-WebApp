import userModel from '../../models/user.model.ts'
import { Firestore, doc, setDoc } from 'firebase/firestore'
import { FirestoreCollections } from '../../constants/FireStoreCollections.ts'

class MarkFavourite{
    static markAsFavourite(
        firestore: Firestore,
        userModel:userModel,
        favourite:string,
        onSuccess:(done: boolean) => void
        ){
        const favouriteList = userModel.favourites.includes(favourite)
            ? userModel.favourites.filter((f) => f !== favourite)
            : [...userModel.favourites, favourite];

        const updatedUserModel = {
            ...userModel,
            favourites: favouriteList,
        };
       const userRef=doc(firestore,FirestoreCollections.USERS_COLLECTION,userModel.username);
       setDoc(userRef,updatedUserModel)
           .then(() => {
               onSuccess(true)
           })
           .catch(() => {
               onSuccess(false)
           })
    }
}

export default MarkFavourite;