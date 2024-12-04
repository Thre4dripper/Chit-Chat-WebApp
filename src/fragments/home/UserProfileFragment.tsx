import React, { SetStateAction } from 'react'
import { Box, Paper, TextField, Typography, Avatar, IconButton } from '@mui/material'
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos'
import Person2Icon from '@mui/icons-material/Person2'
import ReportIcon from '@mui/icons-material/Report'
import MenuBookIcon from '@mui/icons-material/MenuBook'
import ModeEditOutlineIcon from '@mui/icons-material/ModeEditOutline'
import LottieLoading from '../../components/LottieLoading.tsx'
import { useAuthUser } from '../../contexts/UserContext.tsx'

const UserProfileFragment: React.FC<{ openProfile: React.Dispatch<SetStateAction<boolean>> }> = ({
    openProfile,
}) => {
    const { userData } = useAuthUser()
    const printUser = () => {
        //   change it into New Image and Updated Based on This
    }

    if (!userData) {
        return <LottieLoading />
    }

    return (
        <div className={`h-full w-full  bg-transparent relative flex flex-col`}>
            <div className={'text-white my-2 mx-4'}>
                <IconButton>
                    <ArrowBackIosIcon
                        className={'text-white'}
                        onClick={() => {
                            openProfile(false)
                        }}
                    />
                </IconButton>
            </div>
            <Paper
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    flexDirection: 'column',
                    backgroundColor: 'transparent',
                    padding: '30px 20px',
                }}>
                <Avatar
                    src={userData.profileImage}
                    alt={userData.name}
                    sx={{ width: 200, height: 200, fontSize: 100 }}
                />

                <Typography sx={{ color: 'skyblue', margin: '20px' }} onClick={printUser}>
                    Set Profile Photo
                </Typography>
            </Paper>

            <Paper
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem',
                    flexGrow: 1,
                    borderRadius: '20px 20px 0 0',
                    paddingTop: '20px',
                }}>
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '1rem',
                    }}>
                    <Person2Icon />

                    <TextField
                        id='username'
                        label='Username'
                        value={userData?.username}
                        disabled={true}
                        defaultValue={userData?.username}
                    />

                    <ModeEditOutlineIcon sx={{ color: 'grey' }} />
                </Box>
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '1rem',
                        cursor: 'pointer',
                    }}>
                    <ReportIcon />
                    <TextField id='name' label='Name' value={userData?.name} disabled={true} />
                    <ModeEditOutlineIcon />
                </Box>
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '1rem',
                    }}>
                    <MenuBookIcon />
                    <TextField id='boi' label='Bio' value={userData?.bio} disabled={true} />

                    <ModeEditOutlineIcon />
                </Box>
            </Paper>
        </div>
    )
}

export default UserProfileFragment
