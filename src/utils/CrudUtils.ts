import { doc, Firestore, getDoc } from 'firebase/firestore'

class CrudUtils {
    static getFirestoreDocument(
        firestore: Firestore,
        collectionName: string,
        documentId: string,
        onSuccess: (data: Map<string, never> | null) => void
    ) {
        const docRef = doc(firestore, collectionName, documentId)
        getDoc(docRef)
            .then((doc) => {
                if (doc.exists()) {
                    onSuccess(doc.data() as Map<string, never>)
                } else {
                    onSuccess(null)
                }
            })
            .catch((error) => {
                console.error('Error getting document:', error)
                onSuccess(null)
            })
    }
}

export default CrudUtils
