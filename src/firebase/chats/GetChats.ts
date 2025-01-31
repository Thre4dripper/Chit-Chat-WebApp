import { collection,doc, Firestore, query, or, where, getDocs, getDoc } from 'firebase/firestore'
import ChatModel from '../../models/user.chat.model.ts'
import { FirestoreCollections } from '../../constants/FireStoreCollections.ts'

class GetChats {
    static getAllUserChats(
        firestore: Firestore,
        username: string|null,
        onSuccess: (chatList: ChatModel[]) => void
    ) {
        if(!username){
            onSuccess([])
        }
        const ChatCollection = collection(firestore,FirestoreCollections.CHATS_COLLECTION)


        const chatQuery = query(
            ChatCollection,
            or(
                where("dmChatUser1.username", '==', username),
                where("dmChatUser2.username", '==', username)
            )
        )
        getDocs(chatQuery)
            .then((chatQuerySnapshot) => {
                const ChatList: ChatModel[] = []
                for (const doc of chatQuerySnapshot.docs) {
                    const chat = doc.data() as ChatModel
                    ChatList.push(chat)
                }
                onSuccess(ChatList)
            })
            .catch((error) => {
                console.log('Issue in getting a Chats', error)
                onSuccess([])
            })
    }

    static getUserChatById(
        firestore:Firestore,
        chatId:string,
        onSuccess:(chat:ChatModel|null)=>void
    ){
        const ChatRef= doc(firestore,FirestoreCollections.CHATS_COLLECTION,chatId)

          getDoc(ChatRef)
              .then((doc)=>{
                  if(doc.exists()){
                      console.log(doc)
                      onSuccess(doc.data() as ChatModel)
                  }else{
                      onSuccess(null)
                  }
              })
              .catch((error) => {
              console.error('Error getting document:', error)
              onSuccess(null)
          })

    }
}

export default GetChats
