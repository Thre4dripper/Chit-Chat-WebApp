import { Avatar, Badge, IconButton, Typography } from '@mui/material'
import { GlobalConstants } from '../../constants/GlobalConstants.ts'
import LogoutIcon from '@mui/icons-material/Logout'
import React from 'react'
import ItemChat from '../listItems/ItemChat.tsx'
import ItemFavChat from '../listItems/ItemFavChat.tsx'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'

const ChatsFragment: React.FC = () => {
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
                    <IconButton>
                        <Badge
                            overlap='circular'
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'right',
                            }}
                            badgeContent={<div className={'w-3 h-3 bg-green-500 rounded-full'} />}>
                            <Avatar />
                        </Badge>
                    </IconButton>
                </div>
                <div className={'flex flex-col justify-center'}>
                    <IconButton>
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
                        // value={searchTerm}
                        // onChange={handleSearch}
                    />
                </div>
            </div>

            <div
                className={
                    'overflow-y-auto scrollbar-thin scrollbar-thumb-slate-500 scrollbar-track-slate-800/10 scrollbar-thumb-rounded-full'
                }>
                {/*Fav chats list*/}
                <div>
                    <div className={'flex flex-col'}>
                        <div className={'flex flex-row m-4'}>
                            <Typography className={'select-none'} color={'white'} variant={'h6'}>
                                Favourites
                            </Typography>
                        </div>
                        <div className='flex overflow-hidden'>
                            <div className={'flex flex-row gap-4'}>
                                {[1, 2, 3].map((item) => (
                                    <ItemFavChat
                                        key={item}
                                        image={'https://i.pravatar.cc/300'}
                                        name={`Item ${item}`}
                                    />
                                ))}
                            </div>
                            <div className={'flex-auto flex justify-center'}>
                                <div className={'flex flex-col justify-center'}>
                                    <IconButton>
                                        <ArrowForwardIosIcon
                                            className={'text-white'}
                                            sx={{ width: 30, height: 30 }}
                                        />
                                    </IconButton>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/*Chats list*/}
                <div>
                    <div className={'flex flex-col'}>
                        <div className={'flex flex-row m-4'}>
                            <Typography className={'select-none'} color={'white'} variant={'h6'}>
                                Chats
                            </Typography>
                        </div>
                    </div>
                    <div className={'flex flex-col'}>
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13].map((item) => (
                            <ItemChat
                                key={item}
                                image={'https://i.pravatar.cc/300'}
                                primaryText={`Item ${item}`}
                                secondaryText={`Item ${item}`}
                                time={'10:00'}
                                notification={1}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ChatsFragment