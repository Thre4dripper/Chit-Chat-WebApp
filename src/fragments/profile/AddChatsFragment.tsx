import React from 'react'
import addFriend from '../../assets/lottie/add_friends.json'
import Lottie from 'lottie-react'
import { Button } from '@mui/material'
import AddChatDialog, { DialogState } from '../../components/dialogs/AddChatDialog'
const AddChatsFragment: React.FC = () => {
    const [dialogState, setDialogState] = React.useState<DialogState>({
        open: false,
        type: 'Username',
        value: '',
        error: false,
    })
    return (
        <div
            className={
                'bg-blue-50 h-screen rounded-tl-3xl rounded-bl-3xl rounded-tr-3xl rounded-br-3xl flex justify-center items-center'
            }>
            <div className={'flex flex-col'}>
                <Lottie
                    className={'max-h-[300px] max-w-[300px]'}
                    animationData={addFriend}
                    loop={true}
                    autoPlay={true}
                />
                <Button
                    variant='contained'
                    sx={{
                        backgroundColor: '#26283B',
                        color: 'white',
                        maxWidth: '200px',
                        margin: 'auto',
                    }}
                    onClick={() => setDialogState({ ...dialogState, open: true })}>
                    Add Chats
                </Button>
                {/* <Alert icon={<InfoIcon fontSize='inherit' />} severity='info'>
                    Add New Chats 
                </Alert> */}
            </div>
            <AddChatDialog dialogState={dialogState} setDialogState={setDialogState} />
        </div>
    )
}

export default AddChatsFragment
