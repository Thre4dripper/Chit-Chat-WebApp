import React, { useState } from 'react'
import { IconButton } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import SendIcon from '@mui/icons-material/Send'

const ChatInput = () => {
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
            if (lines.length <= 4 && lines.some((line) => line.length === 0)) {
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
        <div className={'bg-slate-300 rounded-bl-3xl rounded-br-3xl'}>
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
                                'flex-1 rounded-md h-10 px-4 py-2 overflow-y-scroll ' +
                                'scrollbar-thin scrollbar-w-4 scrollbar-thumb-slate-500 scrollbar-track-[#1e2a31] scrollbar-thumb-rounded-full'
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
    )
}

export default ChatInput