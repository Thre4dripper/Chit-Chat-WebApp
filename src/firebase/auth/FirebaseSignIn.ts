import {
    GoogleAuthProvider,
    GithubAuthProvider,
    getAuth,
    signInWithPopup,
    User,
    Auth,
    OAuthCredential,
    signOut,
    UserCredential,
    fetchSignInMethodsForEmail,
    linkWithCredential,
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
            const errorCode = error.code
            const credential = GithubAuthProvider.credentialFromError(error)!
            if (errorCode === 'auth/account-exists-with-different-credential') {
                const email = error.customData.email
                linkGithubToGoogle(email, auth, credential, callback)
            } else {
                console.log(error)
                callback(null)
            }
        })
}

const linkGithubToGoogle = (
    email: string,
    auth: Auth,
    credential: OAuthCredential,
    callback: (user: User | null) => void
) => {
    //link github acc to google acc
    fetchSignInMethodsForEmail(auth, email).then((methods) => {
        if (methods[0] === 'google.com') {
            firebaseSignInWithGoogle((user: User | null) => {
                if (user) {
                    linkWithCredential(user, credential)
                        .then((userCred: UserCredential) => {
                            // GitHub account successfully linked to the existing Firebase user.
                            const user = userCred.user
                            callback(user)
                        })
                        .catch((error) => {
                            // Some error occurred.
                            console.log(error)
                            callback(null)
                        })
                } else {
                    callback(null)
                }
            })
        }
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
