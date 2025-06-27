import { Avatar, IconButton, Typography, Switch, Divider } from '@mui/material'
import {
    ArrowBack,
    Send,
    FavoriteBorder,
    Clear,
    DeleteOutline,
    Notifications,
} from '@mui/icons-material'
import emptyImageIconData from '../../assets/lottie/no_photos.json'
import Lottie from 'lottie-react'
import React, { SetStateAction } from 'react' // Import the JSON data

const ViewProfile: React.FC<{ setIsViewing: React.Dispatch<SetStateAction<boolean>> }> = ({
    setIsViewing,
}) => {
    return (
        <div className='bg-slate-900/90 rounded-3xl shadow-md h-full w-full z-50'>
            {/* Header */}
            <div className='flex items-center justify-between p-4'>
                <IconButton onClick={() => setIsViewing(false)}>
                    <ArrowBack className='text-white' />
                </IconButton>
                <IconButton onClick={() => setIsViewing(false)}>
                    <Send className='text-white' />
                </IconButton>
            </div>

            {/* Profile Info */}
            <div className='flex flex-col items-center py-6'>
                <Avatar sx={{ width: 80, height: 80, bgcolor: 'grey.400', fontSize: '2rem' }}>
                    S
                </Avatar>
                <Typography color='white' variant='h6' className='mt-2 font-semibold'>
                    shaddy
                </Typography>
                <Typography variant='subtitle2' color='white'>
                    Shaddy
                </Typography>
            </div>
            <div className={'bg-white rounded-3xl mt-2'}>
                {/* Medias Section */}
                <div className='p-4'>
                    <Typography
                        variant='subtitle1'
                        className='font-semibold text-blue-gray-700 mb-2'>
                        Medias
                    </Typography>
                    <div className='flex justify-center items-center h-24 bg-blue-gray-100 rounded-md'>
                        <Lottie
                            className={'max-h-[200px] max-w-[200px]'}
                            animationData={emptyImageIconData}
                            loop={true}
                            autoPlay={true}
                        />
                    </div>
                </div>

                <Divider />
                <div className='flex items-center justify-between px-4 py-3'>
                    <div className='flex items-center'>
                        <IconButton size='small'>
                            <Notifications />
                        </IconButton>
                        <Typography variant='body1' className='ml-2 text-blue-gray-700'>
                            Mute Notifications
                        </Typography>
                    </div>
                    <Switch />
                </div>

                <Divider />

                <div className='px-4 py-3'>
                    <Typography
                        variant='subtitle1'
                        className='font-semibold text-blue-gray-700 mb-1'>
                        Groups in Common
                    </Typography>
                    <Typography variant='body2' color='textSecondary'>
                        No Groups
                    </Typography>
                </div>

                <Divider />

                <div className='flex items-center px-4 py-3'>
                    <IconButton size='small'>
                        <FavoriteBorder className='text-red-500' />
                    </IconButton>
                    <Typography variant='body1' className='ml-2 text-blue-gray-700'>
                        Favourite
                    </Typography>
                </div>

                <div className='flex items-center px-4 py-3'>
                    <IconButton size='small'>
                        <Clear className='text-orange-500' />
                    </IconButton>
                    <Typography variant='body1' className='ml-2 text-blue-gray-700'>
                        Clear Chat
                    </Typography>
                </div>

                <div className='flex items-center px-4 py-3'>
                    <IconButton size='small'>
                        <DeleteOutline className='text-red-600' />
                    </IconButton>
                    <Typography variant='body1' className='ml-2 text-blue-gray-700'>
                        Delete Chat
                    </Typography>
                </div>
            </div>
        </div>
    )
}

export default ViewProfile
