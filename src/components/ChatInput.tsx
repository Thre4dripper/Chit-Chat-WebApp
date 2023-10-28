import React, { useState, useEffect, useRef } from 'react'
import { IconButton } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import SendIcon from '@mui/icons-material/Send'

const ChatInput: React.FC = () => {
    const [inputValue, setInputValue] = useState('')
    const textareaRef = useRef<HTMLTextAreaElement>(null)
    const [numLines, setNumLines] = useState(1)

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto'
            textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 80)}px`
        }

        const handleWindowResize = () => {
            if (textareaRef.current) {
                textareaRef.current.style.height = 'auto'
                textareaRef.current.style.height = `${Math.min(
                    textareaRef.current.scrollHeight,
                    80
                )}px`
            }
        }

        window.addEventListener('resize', handleWindowResize)

        return () => {
            window.removeEventListener('resize', handleWindowResize)
        }
    }, [inputValue])

    const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        const { value } = event.target
        setInputValue(value)
        setNumLines(value.split('\n').length)
    }

    const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault()
            // Handle sending the message here, e.g., sendMessage(inputValue);
            setInputValue('')
            setNumLines(1)
        }
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
                            ref={textareaRef}
                            value={inputValue}
                            onChange={handleInputChange}
                            onKeyDown={handleKeyDown}
                            rows={numLines}
                            className={
                                'flex-1 rounded-md h-10 px-4 py-2 overflow-y-scroll ' +
                                'scrollbar-thin scrollbar-w-4 scrollbar-thumb-slate-500 scrollbar-track-[#1e2a31] scrollbar-thumb-rounded-full ' +
                                'bg-[#1e2a31] max-h-[80px] min-h-[40px] resize-none text-white '
                            }
                            style={{
                                overflowY: numLines > 3 ? 'scroll' : 'hidden',
                            }}
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
