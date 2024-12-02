import React, { SetStateAction, useState } from 'react'
import { Paper, Typography, Avatar } from '@mui/material'
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos'

import LottieLoading from '../../../components/LottieLoading.tsx'
import { useAuthUser } from '../../../contexts/UseAuthUser.tsx'
import UsersForm from './UsersForm.tsx'

const UserProfileFragment: React.FC<{ openProfile: React.Dispatch<SetStateAction<boolean>> }> = ({
    openProfile,
}) => {
    const { userData } = useAuthUser()
    const [imageError, setImageError] = useState(false)
    const printUser = () => {
        //   change it into New Image and Updated Based on This
    }

    if (!userData) {
        return <LottieLoading />
    }

    return (
        <div className={`h-full w-full  bg-transparent relative flex flex-col`}>
            <button
                className='text-white m-2 absolute'
                onClick={() => {
                    openProfile(false)
                }}>
                <ArrowBackIosIcon />
            </button>
            <Paper
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    flexDirection: 'column',
                    backgroundColor: 'transparent',
                    padding: '30px 20px',
                }}>
                {imageError ? (
                    <Avatar sx={{ width: '200px', height: '200px', fontSize: '100px' }}>
                        {userData.name.charAt(0)}
                    </Avatar>
                ) : (
                    <img
                        src={userData.profileImage}
                        alt='Profile'
                        onError={() => setImageError(true)}
                        style={{ width: '200px', height: '200', borderRadius: '50%' }}
                    />
                )}
                <Typography sx={{ color: 'skyblue', margin: '20px' }} onClick={printUser}>
                    Set Profile Photo
                </Typography>
            </Paper>

            <UsersForm />
        </div>
    )
}

export default UserProfileFragment
