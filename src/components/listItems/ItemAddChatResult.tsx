import { Avatar, Box, Divider, IconButton, Typography } from '@mui/material'
import { Send } from '@mui/icons-material'
import React from 'react'
import UserModel from '../../models/user.model.ts'
import AddChatsStore from '../../store/add.chats.store.ts'
interface ItemAddChatResultProps {
    user: UserModel
   setDialogueState: React.Dispatch<boolean>
}


const ItemAddChatResult: React.FC<ItemAddChatResultProps> = ({ user, setDialogueState }) => {
    const dmChat=AddChatsStore.getState().dmChat;

    const handleNewChat=()=>{
         dmChat(user)
         setDialogueState(false);

    }
    return (
        <>
            <Box
                sx={{
                    'width': '100%',
                    'display': 'flex',
                    'alignItems': 'center',
                    'justifyContent': 'start',
                    'gap': 2,
                    'backgroundColor': '#F1F6FF',
                    'paddingLeft': '16px',
                    'paddingRight': '24px',
                    'paddingTop': '8px',
                    'paddingBottom': '8px',
                    '&:hover': {
                        backgroundColor: '#ebf1ff',
                    },
                }}>
                <Avatar
                    src={user.profileImage}
                    sx={{ bgcolor: 'primary.main', color: 'white' }}></Avatar>
                <Box>
                    <Typography variant='h6' fontWeight='medium'>
                        {user.username}
                    </Typography>
                    <Typography variant='body2' fontWeight='light' color={'gray'}>
                        {user.name.slice(0, 15).concat('..')}
                    </Typography>
                </Box>
                <div className={'flex-1'} />
                <IconButton onClick={handleNewChat}>
                    <Send className={'text-[#1D2C48]'} />
                </IconButton>
            </Box>
            <Divider />
        </>
    )
}

export default ItemAddChatResult
