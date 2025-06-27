import { Badge, IconButton, Typography } from '@mui/material'
import { GlobalConstants } from '../../constants/GlobalConstants.ts'
import LogoutIcon from '@mui/icons-material/Logout'
import ChatIcon from '@mui/icons-material/Chat'
import React, {SetStateAction } from 'react'
import ItemChat from '../../components/listItems/ItemChat.tsx'
import ItemFavChat from '../../components/listItems/ItemFavChat.tsx'
import Avatar from '@mui/material/Avatar'
import useHomeStore from '../../store/home.store.ts'
import useHomeChatsStore from '../../store/home.chats.store.ts'

const ChatsFragment: React.FC<{
    openProfile: React.Dispatch<SetStateAction<boolean>>
    setDialogState: React.Dispatch<SetStateAction<boolean>>
    setLogoutDialogState: React.Dispatch<SetStateAction<boolean>>
}> = ({ openProfile, setDialogState, setLogoutDialogState }) => {
    const { user } = useHomeStore()
    const homeChats = useHomeChatsStore((state) => state.homeChats)
    const favouriteList=useHomeStore((state)=>state.user)?.favourites

    const favouriteChats=useHomeChatsStore((state)=> state.homeChats).filter((chat)=>{
        return favouriteList && chat.userChat ? favouriteList.includes(chat.userChat?.chatId) : false;
    })


    return (
        <div className={'h-screen flex flex-col'}>
            <div className={'h-14 m-4 flex flex-row'}>
                <div className={'flex flex-col justify-center'}>
                    <Typography className={'select-none'} color={'white'} variant={'h4'}>
                        {GlobalConstants.APP_NAME}
                    </Typography>
                </div>

                <div className={'flex-1'} />
                <div className={'flex flex-col justify-center'}>
                    <IconButton onClick={() => setDialogState(true)}>
                        <ChatIcon className={'text-white'} />
                    </IconButton>
                </div>
                <div className={'flex flex-col justify-center rounded-full'}>
                    <IconButton
                        onClick={() => {
                            openProfile(true)
                        }}>
                        <Badge
                            overlap='circular'
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'right',
                            }}
                            badgeContent={<div className={'w-3 h-3 bg-green-500 rounded-full z-0'} />}>
                            <Avatar
                                src={user?.profileImage}
                                sx={{ width: 48, height: 48, fontSize: 28 }}
                                alt={user?.name}
                            />
                        </Badge>
                    </IconButton>
                </div>
                <div className={'flex flex-col justify-center'}>
                    <IconButton onClick={() => setLogoutDialogState(true)}>
                        <LogoutIcon className={'text-white'} />
                    </IconButton>
                </div>
            </div>
            {/*search field*/}
            <div>
                <div className={'mx-4 flex'}>
                    <input
                        className={'flex-1 bg-slate-600 rounded-md h-10 px-4 py-2'}
                        style={{
                            backgroundColor: '#1e2a31',
                            border: 'none',
                            color: 'white',
                        }}
                        type='text'
                        placeholder='Search'
                    />
                </div>
            </div>

            <div
                className={
                    'overflow-y-auto scrollbar-thin scrollbar-thumb-slate-500 scrollbar-track-slate-800/10 scrollbar-thumb-rounded-full'
                }>
                {/*Fav chats list*/}
                {favouriteChats.length>0 && (
                    <div>
                        <div className={'flex flex-col'}>
                            <div className={'flex flex-row m-4'}>
                                <Typography
                                    className={'select-none'}
                                    color={'white'}
                                    variant={'h6'}>
                                    Favourites
                                </Typography>
                            </div>
                            <div className={'flex'}>
                                <div className={'flex flex-row gap-4 overflow-x-scroll scrollbar-thin scrollbar-thumb-transparent scrollbar-track-transparent'}>
                                    {favouriteChats.map((chat) => (
                                        <ItemFavChat
                                            key={chat.id}
                                            chatId={chat.id}
                                            image={chat.userChat?.dmChatUser1.username === user?.username
                                                ? (chat.userChat?.dmChatUser2
                                                    .profileImage as string)
                                                : (chat.userChat?.dmChatUser1
                                                    .profileImage as string)}
                                            name={chat.userChat?.dmChatUser1.username === user?.username
                                                ? (chat.userChat?.dmChatUser2.username as string)
                                                : (chat.userChat?.dmChatUser1.username as string)
                                            }
                                        />
                                    ))}
                                </div>
                                {/*<div className={'flex-auto flex justify-center'}>*/}
                                {/*    <IconButton>*/}
                                {/*        <ArrowForwardIosIcon className={'text-white/50'} />*/}
                                {/*    </IconButton>*/}
                                {/*</div>*/}
                            </div>
                        </div>
                    </div>
                )}

                {/*Chats list*/}
                {homeChats.length > 0 ? (
                    <div>
                        <div className={'flex flex-col m-4'}>
                            <Typography className={'select-none'} color={'white'} variant={'h6'}>
                                Chats
                            </Typography>
                        </div>
                        <div className={'flex flex-col'}>
                            {homeChats.map((chat) => {
                                const unseenMessagesCount = chat.userChat?.chatMessages.filter(
                                    (msg) =>
                                        msg.seenBy.filter((username) => username === user?.username)
                                            .length === 0
                                ).length
                                return (
                                    <ItemChat
                                        key={chat.id}
                                        chatId={chat.id}
                                        image={
                                            chat.userChat?.dmChatUser1.username === user?.username
                                                ? (chat.userChat?.dmChatUser2
                                                      .profileImage as string)
                                                : (chat.userChat?.dmChatUser1
                                                      .profileImage as string)
                                        }
                                        primaryText={
                                            chat.userChat?.dmChatUser1.username === user?.username
                                                ? (chat.userChat?.dmChatUser2.username as string)
                                                : (chat.userChat?.dmChatUser1.username as string)
                                        }
                                        secondaryText={
                                            chat.userChat?.chatMessages[0].text as string
                                        } // dummy message
                                        time={
                                            chat.userChat?.chatMessages[0].time
                                                .toDate()
                                                .toLocaleTimeString('en-US', {
                                                    hour: '2-digit',
                                                    minute: '2-digit',
                                                    hour12: true,
                                                }) as string
                                        } // dummy time
                                        unseenMessageCount={unseenMessagesCount as number}
                                    />
                                )
                            })}
                        </div>
                    </div>
                ) : (
                    <div className={'flex justify-center items-center h-3/4'}>
                        <Typography color={'gray'} variant={'h6'}>
                            No chats found
                        </Typography>
                    </div>
                )}
            </div>
        </div>
    )
}

export default ChatsFragment
