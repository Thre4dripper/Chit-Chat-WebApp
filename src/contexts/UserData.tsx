import React, { createContext, SetStateAction, useState } from 'react'
// import useAuth from "../hooks/useAuth";

export interface UserType {
    bio: string
    favourites: string[]
    fcmToken: string
    groups: string[]
    name: string
    profileImage: string
    status: string
    uid: string
    username: string
}
interface UserAuthType {
    userInfo: UserType | null
    setUserInfo: React.Dispatch<SetStateAction<UserType | null>>
}

export const UserAuth = createContext<UserAuthType>({
    userInfo: null,
    setUserInfo: () => {},
})

const UserDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [userInfo, setUserInfo] = useState<UserType | null>(null)

    return <UserAuth.Provider value={{ userInfo, setUserInfo }}>{children}</UserAuth.Provider>
}

export default UserDataProvider
