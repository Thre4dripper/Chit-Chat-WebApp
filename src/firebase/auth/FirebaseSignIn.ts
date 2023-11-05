import {
    GoogleAuthProvider,
    GithubAuthProvider,
    getAuth,
    signInWithPopup,
    User,
    signOut,
    UserCredential,
} from 'firebase/auth'

export const firebaseSignInWithGoogle = (callback: (user: User | null) => void) => {
    const auth = getAuth()
    const provider = new GoogleAuthProvider()
    signInWithPopup(auth, provider)
        .then((result: UserCredential) => {
            // This gives you a Google Access Token. You can use it to access the Google API.
            const credential = GoogleAuthProvider.credentialFromResult(result)
            const token = credential?.accessToken
            console.log(token)
            // The signed-in user info.
            const user = result.user
            callback(user)
            // ...
        })
        .catch((error) => {
            console.log(error)
            callback(null)
        })
}

export const firebaseSignInWithGithub = (callback: (user: User | null) => void) => {
    const auth = getAuth()
    const provider = new GithubAuthProvider()
    signInWithPopup(auth, provider)
        .then((result: UserCredential) => {
            // This gives you a GitHub Access Token. You can use it to access the GitHub API.
            const credential = GithubAuthProvider.credentialFromResult(result)
            const token = credential?.accessToken
            console.log(token)
            // The signed-in user info.
            const user = result.user
            callback(user)
            // ...
        })
        .catch((error) => {
            console.log(error)
            callback(null)
        })
}

export const firebaseSignOut = () => {
    const auth = getAuth()
    signOut(auth)
        .then(() => {
            // Sign-out successful.
            console.log('Sign-out successful.')
        })
        .catch((error) => {
            // An error happened.
            console.log('Sign-out error', error)
        })
}
