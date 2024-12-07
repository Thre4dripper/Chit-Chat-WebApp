import {firestore} from '../FirebaseInit'
import {doc,getDoc,updateDoc} from 'firebase/firestore'

export const updateUsername=()=>{

}

export const updateName=async (username:string,newName:string)=>{

    try{
       
        const userDocref=doc(firestore,'Users',username)
        const userSnapshot= await getDoc(userDocref)

        if(userSnapshot.exists()){
            console.log("Here we Updated :",newName,"Complete data :",userSnapshot.data());
           
            await updateDoc(doc(firestore, 'Users', username), { name: newName });
            
            
        }

    }catch(err){
        console.log('Error in Updatin Name',newName,err);
    }
      
}

export const updateBio=()=>{

}

