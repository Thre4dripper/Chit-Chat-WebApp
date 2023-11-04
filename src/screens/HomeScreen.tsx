import React from 'react'
import ChatsFragment from '../components/fragments/ChatsFragment.tsx'
import ChattingFragment from '../components/fragments/ChattingFragment.tsx'

const HomeScreen: React.FC = () => {
    return (
        <div className={'flex flex-row bg-slate-900/90 '}>
            <div className={'w-[25rem]'}>
                <ChatsFragment />
            </div>
            <div className={'flex-1 w-2/3 rounded-3xl'}>
                <ChattingFragment />
            </div>
        </div>
    )
}

export default HomeScreen