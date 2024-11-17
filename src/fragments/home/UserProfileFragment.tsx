import React, { SetStateAction, useContext } from 'react'
import { Avatar, TextField, Paper, Typography, Box } from '@mui/material'
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos'
import Person2Icon from '@mui/icons-material/Person2'
import ReportIcon from '@mui/icons-material/Report'
import MenuBookIcon from '@mui/icons-material/MenuBook'
import ModeEditOutlineIcon from '@mui/icons-material/ModeEditOutline'
import { UserAuth } from '../../contexts/UserData'
import LottieLoading from '../../components/LottieLoading'


const UserProfileFragment: React.FC<{ openProfile: React.Dispatch<SetStateAction<boolean>> }> = ({
    openProfile,
}) => {
   
     const {userInfo}=useContext(UserAuth);
    // const userInfo = { username: 'Lucifer', name: 'Anzal', bio: 'I am all time great' };
         const printUSer=()=>{
              
            //   change it into New Image and Updated Based on This
            
         }

    if(!userInfo){
       return (
         <LottieLoading/>
       )
    }
    
    return (
        <div className={`h-full w-full  bg-transparent relative flex flex-col`}>
            <button
                className='text-white m-2 absolute'
                onClick={() => {
                    openProfile(false)
                }}>
                <ArrowBackIosIcon /> Back
            </button>
            <Paper sx={{ display: 'flex', alignItems: 'center', flexDirection: 'column',backgroundColor:"transparent",padding:'30px 20px' }}>
                <Avatar src={userInfo.profileImage} alt="User Profile Image" sx={{ width: '200px', height: '200px' }}></Avatar>
                 {/* <img src={userInfo.profileImage} alt="no image"/> */}
                <Typography sx={{color:"skyblue",margin:"20px"}} onClick={printUSer}> Set Profile Photo </Typography>
            </Paper>

            

            <Paper sx={{ display: 'flex', flexDirection: 'column', gap: '1rem',flexGrow:1,borderRadius:'20px 20px 0 0',paddingTop:"20px"}}>
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
                        value={userInfo.username}
                        variant='standard'
                        slotProps={{
                            input: {
                              readOnly: true, 
                              style: {
                                
                                border: 'none', 
                                outline: 'none', 
                                
                              },
                              onFocus: (e) => e.target.blur(), 
                              disableUnderline: true,
                            },
                          }}
                        
                    />
                        
                    
                    <ModeEditOutlineIcon sx={{color:'grey'}}/>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center',gap: '1rem',cursor:"pointer" }}>
                    <ReportIcon />
                    <TextField
                        id='name'
                        label='Name'
                        value={userInfo.name}
                        variant='standard'
                        slotProps={{
                            input: {
                              readOnly: true, 
                              style: {
                                cursor: 'pointer',
                                border: 'none', 
                                outline: 'none',
                               
                              },
                              onFocus: (e) => e.target.blur(),
                              disableUnderline: true, 
                            },
                          }}
                        aria-readonly
                    />
                    <ModeEditOutlineIcon />
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center',gap: '1rem', }}>
                    <MenuBookIcon />
                    <TextField
                        id='boi'
                        label='Bio'
                        value={userInfo.bio}
                        variant='standard'
                        slotProps={{
                            input: {
                              readOnly: true, 
                              style: {
                                
                                border: 'none', 
                                outline: 'none', 
                                
                              },
                              onFocus: (e) => e.target.blur(), 
                              disableUnderline: true,
                            },
                          }}
                        
                    />
                  
                    <ModeEditOutlineIcon />
                </Box>
            </Paper>
        </div>
    )
}

export default UserProfileFragment
