import React from 'react'
import ChatsFragment from '../fragments/home/ChatsFragment.tsx'
import useLocalStorage from '../hooks/useLocalStorage.ts'
import { GlobalConstants } from '../constants/GlobalConstants.ts'
import EmptyChatFragment from '../fragments/home/EmptyChatFragment.tsx'

const HomeScreen: React.FC = () => {
    const [username] = useLocalStorage(GlobalConstants.USERNAME, '')
    console.log(username)
    return (
        <div className={'flex flex-row bg-slate-900/90 '}>
            <div className={'w-[25rem]'}>
                <ChatsFragment />
            </div>
            <div className={'flex-1 w-2/3 rounded-3xl'}>
                {/*<ChattingFragment />*/}
                <EmptyChatFragment />
            </div>
        </div>
    )
}

export default HomeScreen
