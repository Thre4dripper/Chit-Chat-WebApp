import React, { SetStateAction } from 'react'
import { Box, Paper, TextField, Typography, Avatar, IconButton } from '@mui/material'
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos'
import Person2Icon from '@mui/icons-material/Person2'
import ReportIcon from '@mui/icons-material/Report'
import MenuBookIcon from '@mui/icons-material/MenuBook'
import ModeEditOutlineIcon from '@mui/icons-material/ModeEditOutline'
import LottieLoading from '../../components/LottieLoading.tsx'
import { useAuthUser } from '../../contexts/UserContext.tsx'
import { z } from 'zod'
import { useForm ,SubmitHandler} from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
// import { updateName } from '../../firebase/profile/UpdateProfile.ts'
const userFormSchema = z.object({
    username: z.string().min(4, 'Not a Valid Username'),
    name: z.string().min(4, 'Not a Valid Name'),
    bio: z.string().max(100, 'Bio is too long'),
})
type FormValues = z.infer<typeof userFormSchema>

const UserProfileFragment: React.FC<{ openProfile: React.Dispatch<SetStateAction<boolean>> }> = ({
    openProfile,
}) => {
    const { userData } = useAuthUser()

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormValues>({
        resolver: zodResolver(userFormSchema),
        mode: 'onChange',
        defaultValues:{
            username:userData?.username??'',
            name:userData?.name??'',
            bio:userData?.bio??''
        }
        })

    console.log(errors.username)

    const onSubmit:SubmitHandler<FormValues> = () => {
         console.log('Submitted')
    }
    const printUser = () => {
        //   change it into New Image and Updated Based on This
    }
    if (!userData) {
        return <LottieLoading />
    }

    return (
        <div className={`h-full w-full  bg-transparent relative flex flex-col`}>
            <div className={'text-white my-2 mx-4'}>
                <IconButton
                    onClick={() => {
                        openProfile(false)
                    }}>
                    <ArrowBackIosIcon className={'text-white'} />
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
                component="form"
                noValidate
                onSubmit={handleSubmit(onSubmit)}
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem',
                    flexGrow: 1,
                    borderRadius: '20px 20px 0 0',
                    padding: '20px 40px',
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '1rem',
                        cursor: 'pointer',
                    }}
                >
                    <Person2Icon />
                    <TextField
                        label="username"
                        {...register('username')}
                        error={!!errors.username}
                        helperText={errors.username?.message}
                        size="small"
                        variant="outlined"
                        // disabled={true}
                        sx={{ flexGrow: 1 }}
                    />
                    <IconButton sx={{ color: 'grey' }}>
                        <ModeEditOutlineIcon />
                    </IconButton>
                </Box>

                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '1rem',
                        cursor: 'pointer',
                    }}
                >
                    <ReportIcon />

                    <TextField
                        label="Name"
                        {...register('name')}
                        error={!!errors.name}
                        helperText={errors.name?.message}
                        size="small"
                        variant="outlined"
                        // disabled={true}
                        sx={{ flexGrow: 1 }}
                    />
                    <IconButton sx={{ color: 'grey' }}>
                        <ModeEditOutlineIcon />
                    </IconButton>
                </Box>
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '1rem',
                        cursor: 'pointer',
                    }}
                >
                    <MenuBookIcon />
                    <TextField
                        label="Bio"
                        {...register('bio')}
                        error={!!errors.bio}
                        helperText={errors.bio?.message}
                        size="small"
                        variant="outlined"
                        // disabled={true}
                        sx={{ flexGrow: 1 }}
                    />
                    <IconButton sx={{ color: 'grey' }} >
                        <ModeEditOutlineIcon />
                    </IconButton>
                </Box>

              

            </Paper>
        </div>
    )
}

export default UserProfileFragment
