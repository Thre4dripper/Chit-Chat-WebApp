import { useContext } from 'react'
import { UserContext } from './UserData.tsx'

export const useAuthUser = () => {
    const context = useContext(UserContext)

    if (!context) {
        throw new Error('useAuthUser must be used within a UserDataProvider')
    }

    return context
}