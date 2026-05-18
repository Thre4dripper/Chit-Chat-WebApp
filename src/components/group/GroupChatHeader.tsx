import CircularImage from '../CircularImage.tsx'
import { IconButton, Menu, MenuItem } from '@mui/material'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import React, { useState } from 'react'
import useChatDetailsStore from '../../store/chat.details.store.ts'
import ConfirmDialog from '../dialogs/ConfirmDialog.tsx'


const GroupChatHeader: React.FC = () => {
    const groupChat = useChatDetailsStore((state) => state.groupChatDetails)
    const exitGroup = useChatDetailsStore((state) => state.exitGroup)
    const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null)
    const [exitConfirmOpen, setExitConfirmOpen] = useState(false)

    if (!groupChat) return <></>

    const membersText = groupChat.members.map((m) => m.username).join(', ')

    return (
        <div
            className={
                'z-50 bg-slate-300 rounded-3xl shadow-slate-950/20 shadow-md flex flex-row px-4 pt-4 pb-2 relative'
            }>
            <CircularImage isGroup={true} image={groupChat.image as string} size={48} />
            <div className={'mx-4 flex flex-col flex-auto justify-center overflow-hidden'}>
                <div className={'flex flex-row justify-between'}>
                    <span className={'text-black text-lg font-bold'}>{groupChat.name}</span>
                </div>
                <div className={'flex flex-row justify-between'}>
                    <span className={'text-gray-600 font-medium text-sm truncate'}>{membersText}</span>
                </div>
            </div>
            <div>
                <div className={'mt-2'}>
                    <IconButton onClick={(e) => setMenuAnchor(e.currentTarget)}>
                        <MoreVertIcon className={'text-gray-500'} />
                    </IconButton>
                    <Menu
                        anchorEl={menuAnchor}
                        open={Boolean(menuAnchor)}
                        onClose={() => setMenuAnchor(null)}>
                        <MenuItem
                            onClick={() => {
                                setMenuAnchor(null)
                                setExitConfirmOpen(true)
                            }}>
                            Exit Group
                        </MenuItem>
                    </Menu>
                </div>
            </div>
            <ConfirmDialog
                open={exitConfirmOpen}
                handleClose={() => setExitConfirmOpen(false)}
                title="Exit Group"
                message="Are you sure you want to exit this group?"
                action={() => {
                    setExitConfirmOpen(false)
                    exitGroup()
                }}
            />
        </div>
    )
}

export default GroupChatHeader

