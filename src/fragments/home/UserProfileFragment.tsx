import React, { SetStateAction } from 'react'
import { Box, Paper, Typography, Avatar, IconButton, Button } from '@mui/material'
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos'
import Person2Icon from '@mui/icons-material/Person2'
import MenuBookIcon from '@mui/icons-material/MenuBook'
import ModeEditOutlineIcon from '@mui/icons-material/ModeEditOutline'
import useHomeStore from '../../store/home.store.ts'
import LottieLoading from '../../components/LottieLoading.tsx'
import InfoIcon from '@mui/icons-material/Info'
import { enqueueSnackbar } from 'notistack'

interface UserProfileFragmentProps {
    openProfile: React.Dispatch<SetStateAction<boolean>>
}

const UserProfileFragment: React.FC<UserProfileFragmentProps> = ({ openProfile }) => {
    const user = useHomeStore((state) => state.user)

    if (!user) {
        return <LottieLoading fullParent />
    }

    const setUsername = () => {
        console.log('set username', user.username)
    }

    const setName = () => {
        if (!user.username) {
            enqueueSnackbar('Set Username First', { variant: 'info', autoHideDuration: 3000 })
            return
        }

    }

    const setBio = () => {
        if (!user.username) {
            enqueueSnackbar('Set Username First', { variant: 'info', autoHideDuration: 3000 })
            return
        }

    }

    return (
        <div className={`h-full w-full  bg-transparent relative flex flex-col`}>
            {/* User Cannot go back until complete profile */}
            {user.username && (
                <div className={'text-white my-2 mx-4'}>
                    <IconButton
                        onClick={() => {
                            openProfile(false)
                        }}>
                        <ArrowBackIosIcon className={'text-white'} />
                    </IconButton>
                </div>
            )}
            <Paper
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    flexDirection: 'column',
                    backgroundColor: 'transparent',
                    padding: '30px 20px',
                }}>
                <Avatar
                    src={user.profileImage}
                    alt={user.name}
                    sx={{ width: 200, height: 200, fontSize: 100 }}
                    imgProps={{ referrerPolicy: 'no-referrer' }}
                />
                <Button
                    variant={'text'}
                    sx={{
                        textTransform: 'none',
                        marginTop: '1rem',
                        color: '#90B4F8',
                    }}>
                    Set Profile Photo
                </Button>
            </Paper>

            <Paper
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem',
                    flexGrow: 1,
                    borderRadius: '20px 20px 0 0',
                    padding: '20px 40px',
                }}>
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '1.5rem',
                        cursor: 'pointer',
                    }}>
                    <Person2Icon className={'text-gray-500'} />
                    <div className={'flex-1 flex flex-col gap-1.5'}>
                        <Typography variant={'caption'} color={'textSecondary'}>
                            Username
                        </Typography>
                        <Typography color={user.username.length === 0 ? 'error' : 'primary'}>
                            {user.username.length === 0 ? 'No Username' : user.username}
                        </Typography>
                    </div>
                    <IconButton onClick={setUsername}>
                        <ModeEditOutlineIcon className={'text-gray-700'} />
                    </IconButton>
                </Box>

                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '1.5rem',
                        cursor: 'pointer',
                    }}>
                    <InfoIcon className={'text-gray-500'} />
                    <div className={'flex-1 flex flex-col gap-1.5'}>
                        <Typography variant={'caption'} color={'textSecondary'}>
                            Name
                        </Typography>
                        <Typography>{user.name}</Typography>
                    </div>
                    <IconButton onClick={setName}>
                        <ModeEditOutlineIcon className={'text-gray-700'} />
                    </IconButton>
                </Box>
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '1.5rem',
                        cursor: 'pointer',
                    }}>
                    <MenuBookIcon className={'text-gray-500'} />
                    <div className={'flex-1 flex flex-col gap-1.5'}>
                        <Typography variant={'caption'} color={'textSecondary'}>
                            Bio
                        </Typography>
                        <Typography color={'textSecondary'}>
                            {user.bio.length === 0 ? 'No Bio' : user.bio}
                        </Typography>
                    </div>
                    <IconButton onClick={setBio}>
                        <ModeEditOutlineIcon className={'text-gray-700'} />
                    </IconButton>
                </Box>
            </Paper>
        </div>
    )
}

export default UserProfileFragment
