import CircularImage from '../components/CircularImage.tsx'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import { IconButton } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import SendIcon from '@mui/icons-material/Send'
import React, { useState } from 'react'
import ItemLeftStickerMsg from '../components/chatMessages/ItemLeftStickerMsg.tsx'
import stickerData from '../assets/stickers/sticker_ghost_1.json'

const ChattingFragment: React.FC = () => {
    const [inputValue, setInputValue] = useState('')
    const [keyboardHeight, setKeyboardHeight] = useState(40)

    const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault()
            // Handle sending the message here, e.g., sendMessage(inputValue);
            setInputValue('')
            setKeyboardHeight(40)
        } else if (event.key === 'Enter' && event.shiftKey) {
            setKeyboardHeight((prev) => {
                if (prev < 100) {
                    return prev + 20
                } else {
                    return prev
                }
            })
        } else if (event.key === 'Backspace') {
            const lines = inputValue.split('\n')
            if (lines.length <= 4 && lines[lines.length - 1].length === 0) {
                setKeyboardHeight((prev) => {
                    if (prev > 40) {
                        return prev - 20
                    } else {
                        return prev
                    }
                })
            }
        }
    }

    const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setInputValue(event.target.value)
    }
    return (
        <div className={'bg-blue-50 h-screen rounded-tl-3xl rounded-bl-3xl'}>
            <div className={'flex flex-col h-screen'}>
                {/*Header section*/}
                <div className={'bg-slate-300  rounded-tl-3xl'}>
                    <div className={'flex flex-row px-4 pt-4 pb-2'}>
                        <CircularImage image={'https://i.pravatar.cc/300'} size={48} />
                        <div className={'mx-4 flex flex-col flex-auto justify-center'}>
                            <div className={'flex flex-row justify-between'}>
                                <span className={'text-black text-lg font-bold'}>
                                    {'Chat Name'}
                                </span>
                            </div>
                            <div className={'flex flex-row justify-between'}>
                                <span className={'text-green-600 font-medium text-sm'}>
                                    {'Online'}
                                </span>
                            </div>
                        </div>
                        <div>
                            <div className={'mt-2'}>
                                <IconButton>
                                    <MoreVertIcon className={'text-gray-500'} />
                                </IconButton>
                            </div>
                        </div>
                    </div>
                </div>
                {/*Chatting section*/}
                <div className={'flex-1 bg-white no-scrollbar overflow-y-scroll'}>
                    <div>
                        {/*Chatting list*/}
                        <div className={'flex flex-col gap-2'}>
                            {/*<ItemLeftTextMsg*/}
                            {/*    profileImage={'https://i.pravatar.cc/300'}*/}
                            {/*    message={'Hello world'}*/}
                            {/*    time={'10:00'}*/}
                            {/*/>*/}

                            {/*<ItemLeftImageMsg*/}
                            {/*    profileImage={'https://i.pravatar.cc/300'}*/}
                            {/*    image={*/}
                            {/*        'https://images.unsplash.com/photo-1575936123452-b67c3203c357?auto=format&fit=crop&q=80&w=1000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aW1hZ2V8ZW58MHx8MHx8fDA%3D'*/}
                            {/*    }*/}
                            {/*    time={'10:00'}*/}
                            {/*/>*/}

                            <ItemLeftStickerMsg
                                profileImage={'https://i.pravatar.cc/300'}
                                stickerData={stickerData}
                                time={'10:00'}
                            />
                        </div>
                    </div>
                </div>
                {/*Keyboard section*/}
                <div className={'bg-slate-300 rounded-bl-3xl'}>
                    <div className={'flex flex-row px-4 py-2 h-fit'}>
                        <div className={'flex flex-row gap-2 flex-auto'}>
                            <div className={'flex flex-col justify-end'}>
                                <div className={'flex flex-row gap-2'}>
                                    <IconButton>
                                        <AddIcon className={'text-gray-700'} />
                                    </IconButton>
                                </div>
                            </div>
                            <div className={'flex flex-row flex-auto'}>
                                <textarea
                                    className={
                                        'flex-1 rounded-md h-10 px-4 py-2 no-scrollbar overflow-scroll'
                                    }
                                    style={{
                                        backgroundColor: '#1e2a31',
                                        border: 'none',
                                        color: 'white',
                                        resize: 'none',
                                        height: keyboardHeight,
                                    }}
                                    value={inputValue}
                                    onChange={handleInputChange}
                                    onKeyDown={handleKeyDown}
                                    placeholder='Type a message'
                                />
                            </div>
                            <div className={'flex flex-col justify-end'}>
                                <div className={'flex flex-row'}>
                                    <IconButton>
                                        <SendIcon className={'text-gray-700'} />
                                    </IconButton>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ChattingFragment
