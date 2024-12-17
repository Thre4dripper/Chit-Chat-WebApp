import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'

type localState = {
    username: string | null
    fcmToken: string | null
}

type localActions = {
    setUsername: (username: string) => void
    setFcmToken: (fcmToken: string) => void
}

const useLocalStore = create<localState & localActions>()(
    devtools(
        persist(
            immer((set) => ({
                username: null,
                fcmToken: null,
                setUsername: (username) => set({ username }),
                setFcmToken: (fcmToken) => set({ fcmToken }),
            })),
            { name: 'local-storage' }
        )
    )
)

export default useLocalStore
