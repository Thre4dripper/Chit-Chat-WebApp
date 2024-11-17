import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";
import { User } from "firebase/auth";
import firebaseApp from "../FirebaseInit";
import { UserType } from "../../contexts/UserData";
const firestore = getFirestore(firebaseApp);

export const registerInitialUser = async (user: User) => {
  try {
    // Check if user is already registered
    const userDocRef = doc(firestore, "Users", user.uid);
    const userSnapshot = await getDoc(userDocRef);

    if (userSnapshot.exists()) {
      console.log("User already exists", userSnapshot.data() as UserType);
      return userSnapshot.data() as UserType; // User already registered
    }

    // Create new user Just using this Not class Is it okey ??
    const userData = {
      uid: user.uid,
      bio: "",
      name: user.displayName || "",
      profileImage: user.photoURL || "",
      status: "Online",
      favourites: [],
      fcmToken: "",
      groups: [],
      username: "",
    };

    // Register user with uid as document id
    await setDoc(userDocRef, userData);

    return userData as UserType;
  } catch (error) {
    console.error("Error registering user:", error);
    return null;
  }
};
