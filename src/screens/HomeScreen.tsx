import React from 'react'
import ChatsFragment from '../fragments/home/ChatsFragment.tsx'
import ChattingFragment from '../fragments/home/ChattingFragment.tsx'
import UserProfileFragment from '../fragments/home/UserProfileFragment.tsx'

const HomeScreen: React.FC = () => {
    const [profileOpen, setProfileOpen] = React.useState<boolean>(false)
    return (
        <div className={'flex flex-row bg-slate-900/90 '}>
            <div className={'w-[25rem]'}>
                {profileOpen ? (
                    <UserProfileFragment openProfile={setProfileOpen} />
                ) : (
                    <ChatsFragment openProfile={setProfileOpen} />
                )}
            </div>
            <div className={'flex-1 w-2/3 rounded-3xl'}>
                <ChattingFragment />
            </div>
        </div>
    )
}

export default HomeScreen
