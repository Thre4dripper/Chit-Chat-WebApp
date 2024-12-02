import React from 'react'
import Person2Icon from '@mui/icons-material/Person2'
import ReportIcon from '@mui/icons-material/Report'
import MenuBookIcon from '@mui/icons-material/MenuBook'
import ModeEditOutlineIcon from '@mui/icons-material/ModeEditOutline'
import { Box, Paper, TextField } from '@mui/material'
import { useAuthUser } from '../../../contexts/UseAuthUser.tsx'

const UsersForm: React.FC = () => {
    const { userData } = useAuthUser()
    return (
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
    )
}

export default UsersForm
