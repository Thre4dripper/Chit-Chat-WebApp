import React, { useState } from 'react'
import {
    Avatar,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Divider,
    TextField,
    Typography,
    Stack,
    Box,
} from '@mui/material'
import { Person, Info, Edit } from '@mui/icons-material'
import useUserDetailsStore from '../../store/user.details.store.ts'

interface SetDetailsDialogProps {
    open: boolean
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
    type: 'Username' | 'Name' | 'Bio'
}

const configs = [
    {
        type: 'Username',
        title: 'Set Username',
        description:
            'You have to choose a username on Chit Chat in order to be found by the people. People will be able to find you by this username and contact you.\n\nYou can use a–z, 0–9, and underscores. Minimum length is 5 characters, and it has to be unique.\n\nRemember: Username can only be set once.',
        icon: <Person />,
    },
    {
        type: 'Name',
        title: 'Set Name',
        description:
            'You have to choose a name on Chit Chat. It will appear on your profile.\n\nYou can use a–z, 0–9, and underscores. Minimum length is 5 characters.',
        icon: <Edit />,
    },
    {
        type: 'Bio',
        title: 'Set Bio',
        description:
            'You can add something about yourself. It will appear on your profile. Anyone who visits your profile will be able to see it.',
        icon: <Info />,
    },
]

const SetDetailsDialog: React.FC<SetDetailsDialogProps> = ({ open, setOpen, type }) => {
    const config = configs.find((config) => config.type === type)

    const [inputValue, setInputValue] = useState('')

    const { updateUsername, updateName, updateBio } = useUserDetailsStore()

    if (!config) {
        return null
    }

    const setDetails = () => {
        switch (type) {
            case 'Username':
                updateUsername(inputValue, (success) => {
                    if (success) {
                        setOpen(false)
                    } else {
                        console.log('Username already exists')
                    }
                })
                break
            case 'Name':
                updateName(inputValue, (success) => {
                    if (success) {
                        setOpen(false)
                    }
                })
                break
            case 'Bio':
                updateBio(inputValue, (success) => {
                    if (success) {
                        setOpen(false)
                    }
                })
                break
            default:
                break
        }
    }

    const { title, description, icon } = config
    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(event.target.value)
    }

    return (
        <Dialog
            fullWidth
            maxWidth='sm'
            open={open}
            onClose={() => setOpen(false)}
            sx={{
                '& .MuiDialog-paper': {
                    borderRadius: 4,
                    overflow: 'hidden',
                },
            }}>
            {/* Accent Bar */}
            <Box height={6} bgcolor='primary.main' />

            <DialogTitle>
                <Stack direction='row' alignItems='center' spacing={2}>
                    <Avatar sx={{ bgcolor: 'primary.main', color: 'white' }}>{icon}</Avatar>
                    <Typography variant='h5' fontWeight='bold'>
                        {title}
                    </Typography>
                </Stack>
            </DialogTitle>

            <Divider />

            <DialogContent>
                <Box my={2} display='flex' flexDirection='column' gap={3}>
                    {/* Input Section */}
                    <Stack spacing={1}>
                        <TextField
                            fullWidth
                            label={type}
                            variant='outlined'
                            value={inputValue}
                            onChange={handleInputChange}
                            helperText={`Enter your ${type.toLowerCase()} here.`}
                        />
                        <Typography variant='body2' color='text.secondary' textAlign='right'>
                            {inputValue.length}/50 characters
                        </Typography>
                    </Stack>

                    {/* Description Section */}
                    <DialogContentText
                        sx={{
                            textAlign: 'justify',
                            fontSize: 14,
                            lineHeight: 1.6,
                            whiteSpace: 'pre-line',
                        }}>
                        {description}
                    </DialogContentText>
                </Box>
            </DialogContent>

            <DialogActions sx={{ px: 3, py: 2 }}>
                <Button onClick={() => setOpen(false)} variant='text' color='error'>
                    Cancel
                </Button>
                <Button
                    onClick={() => {
                        setDetails()
                    }}
                    variant='text'
                    color='primary'>
                    Set {type}
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default SetDetailsDialog
