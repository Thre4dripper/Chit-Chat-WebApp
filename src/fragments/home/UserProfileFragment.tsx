import React, { SetStateAction } from 'react'
import { Avatar, TextField, Paper, Typography, Box } from '@mui/material'
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos'
import Person2Icon from '@mui/icons-material/Person2'
import ReportIcon from '@mui/icons-material/Report'
import MenuBookIcon from '@mui/icons-material/MenuBook'
import ModeEditOutlineIcon from '@mui/icons-material/ModeEditOutline'

const UserProfileFragment: React.FC<{ openProfile: React.Dispatch<SetStateAction<boolean>> }> = ({
    openProfile,
}) => {
    const userinfo = { username: 'Lucifer', name: 'Anzal', bio: 'I am all time great' }
    return (
        <div className={`h-full w-full`}>
            <button
                onClick={() => {
                    openProfile(false)
                }}>
                <ArrowBackIosIcon /> Back
            </button>
            <Paper sx={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
                <Avatar sx={{ width: '200px', height: '200px' }}></Avatar>
                <Typography> set Profile Photo </Typography>
            </Paper>

            {/*  push code and pull  before working !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! Going to Sleep */}

            <Paper sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem',
                    }}>
                    <Person2Icon />
                    <TextField
                        id='username'
                        label='Username'
                        value={userinfo.username}
                        variant='standard'
                        sx={{}}
                    />
                    <ModeEditOutlineIcon />
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <ReportIcon />
                    <TextField
                        id='name'
                        label='Name'
                        value={userinfo.name}
                        variant='standard'
                        aria-readonly
                    />
                    <ModeEditOutlineIcon />
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <MenuBookIcon />
                    <TextField
                        id='boi'
                        label='Bio'
                        value={userinfo.bio}
                        variant='standard'
                        aria-readonly
                    />
                    <ModeEditOutlineIcon />
                </Box>
            </Paper>
        </div>
    )
}

export default UserProfileFragment
