import React from 'react'
import androidImage from '../assets/chit_chat_android.png'
import icon from '../assets/logo.png'
import { NoEncryption } from '@mui/icons-material'
import { enqueueSnackbar } from 'notistack'

const MobileScreen: React.FC = () => {
    const handleDownload = () => {
        enqueueSnackbar(
            "Android may show an install warning because this release isn't from the Play Store.",
            { variant: 'info', autoHideDuration: 5000 }
        )
        window.open('https://github.com/Thre4dripper/Chit-Chat-AndroidApp/releases', '_blank')
    }

    return (
        <div className='min-h-screen bg-slate-900 flex flex-col items-center justify-center px-6 py-12 gap-8'>
            <div className='relative flex items-center justify-center'>
                <img className='w-48' src={androidImage} alt='ChitChat Android app' />
                <img className='absolute bottom-8 -right-6 w-16' src={icon} alt='ChitChat icon' />
            </div>

            <div className='flex flex-col items-center gap-3 text-center'>
                <span className='text-white text-2xl font-semibold'>Chit Chat</span>
                <span className='text-white text-xl font-thin'>
                    Download the Android app for the best experience
                </span>
                <span className='text-slate-400 text-base'>
                    The web version is designed for desktop. Get the full experience on your Android
                    device.
                </span>
            </div>

            <button
                type='button'
                onClick={handleDownload}
                className='px-10 py-3 bg-slate-700 rounded-full flex items-center justify-center cursor-pointer hover:bg-slate-600 transition-all duration-300'>
                <span className='text-white text-lg select-none'>Download for Android</span>
            </button>

            <div className='flex flex-row gap-1 items-center justify-center mt-auto'>
                <NoEncryption className='text-slate-500' style={{ transform: 'scale(0.7)' }} />
                <span className='text-slate-500 text-xs'>
                    Messages are not end-to-end encrypted
                </span>
            </div>
        </div>
    )
}

export default MobileScreen
