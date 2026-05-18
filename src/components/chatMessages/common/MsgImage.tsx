import React, { useState } from 'react'
import { ButtonBase } from '@mui/material'
import ViewImageDialog from '../../dialogs/ViewImageDialog.tsx'

interface LeftImageProps {
    image: string
}

const MsgImage: React.FC<LeftImageProps> = ({ image }) => {
    const [openView, setOpenView] = useState(false)
    return (
        <>
            <ButtonBase
                className='flex items-center justify-center'
                onClick={() => setOpenView(true)}>
                <div className='m-1.5 w-[250px] h-[250px] overflow-hidden rounded-3xl'>
                    <img
                        src={image}
                        className='w-full h-full object-cover'
                        onError={(e) => {
                            const target = e.target as HTMLImageElement
                            target.onerror = null
                            target.src = 'https://placehold.co/600x400?text=Loading...'
                        }}
                        alt='Message attachment'
                    />
                </div>
            </ButtonBase>
            <ViewImageDialog
                open={openView}
                setOpen={setOpenView}
                image={image}
                zoomIntensity={10}
                delay={0.2}
                initialZoomLevel={1}
                minZoomLevel={1}
                maxZoomLevel={2.5}
            />
        </>
    )
}

export default MsgImage
