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
import { LoadingButton } from '@mui/lab'
import { enqueueSnackbar } from 'notistack'
import { SuccessMessages } from '../../constants/SuccessMessages.ts'
import { ErrorMessages } from '../../constants/ErrorMessages.ts'
import useLocalStore from '../../store/local.store.ts'

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
            'You have to choose a username on Chit Chat in order to be found by the people. People will be able to find you by this username and contact you.\n\nYou can use a–z, 0–9, and underscores. Minimum length is 4 characters, and it has to be unique.\n\nRemember: Username can only be set once.',
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

    const [inputValue, setInputValue] = useState<string>('')
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState<boolean>(false)

    const { updateUsername, updateName, updateBio } = useUserDetailsStore()

    if (!config) {
        return null
    }
    const { title, description, icon } = config

    const saveDetails = () => {
        switch (type) {
            case 'Username':
                saveUsername()
                break
            case 'Name':
                saveName()
                break
            case 'Bio':
                saveBio()
                break
            default:
                break
        }
    }

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(event.target.value)
    }

    const saveUsername = () => {
        setLoading(true)
        if (inputValue.length === 0) {
            setError('Username cannot be empty')
            setLoading(false)
            return
        }

        if (inputValue.length < 4) {
            setError('Username must be at least 4 characters long')
            setLoading(false)
            return
        }

        if (inputValue.length > 15) {
            setError('Username must be at most 15 characters long')
            setLoading(false)
            return
        }

        const regex = RegExp('^[a-zA-Z0-9_]*$')
        if (!regex.test(inputValue)) {
            setError('Username can only contain letters, numbers, underscores')
            setLoading(false)
            return
        }

        setError(null)
        updateUsername(inputValue, (message) => {
            switch (message) {
                case SuccessMessages.USERNAME_UPDATED_SUCCESSFULLY:
                    enqueueSnackbar(message, {
                        variant: 'success',
                        autoHideDuration: 3000,
                    })
                    useLocalStore.getState().setUsername(inputValue)
                    setInputValue('')
                    setOpen(false)
                    break
                case ErrorMessages.USERNAME_ALREADY_EXISTS:
                    setError(message)
                    break
                default:
                    setError(message)
                    break
            }
            setLoading(false)
        })
    }

    const saveName = () => {
        setLoading(true)
        if (inputValue.length === 0) {
            setError('Name cannot be empty')
            setLoading(false)
            return
        }

        setError(null)
        updateName(inputValue, (message) => {
            if (message === SuccessMessages.NAME_UPDATED_SUCCESSFULLY) {
                enqueueSnackbar(message, {
                    variant: 'success',
                    autoHideDuration: 3000,
                })
                setInputValue('')
                setOpen(false)
            } else {
                setError(message)
            }
            setLoading(false)
        })
    }

    const saveBio = () => {
        setLoading(true)
        setError(null)
        updateBio(inputValue, (message) => {
            if (message === SuccessMessages.BIO_UPDATED_SUCCESSFULLY) {
                enqueueSnackbar(message, {
                    variant: 'success',
                    autoHideDuration: 3000,
                })
                setInputValue('')
                setOpen(false)
            } else {
                setError(message)
            }
            setLoading(false)
        })
    }

    return (
        <Dialog
            fullWidth
            maxWidth='sm'
            open={open}
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
                            error={Boolean(error)}
                            onChange={handleInputChange}
                            helperText={`${error ? error : ''}`}
                        />
                        <Typography variant='body2' color='text.secondary' textAlign='right'>
                            {inputValue.length}/15 characters
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
                <Button onClick={() => setOpen(false)} variant='outlined' color='error'>
                    Cancel
                </Button>
                {loading ? (
                    <LoadingButton
                        loading={loading}
                        loadingPosition={'start'}
                        startIcon={icon}
                        onClick={() => {
                            saveDetails()
                        }}
                        variant='outlined'
                        color='primary'>
                        Save
                    </LoadingButton>
                ) : (
                    <Button
                        onClick={() => {
                            saveDetails()
                        }}
                        variant='outlined'
                        color='primary'>
                        Save
                    </Button>
                )}
            </DialogActions>
        </Dialog>
    )
}

export default SetDetailsDialog
