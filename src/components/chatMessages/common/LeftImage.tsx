import React from 'react'
import { IconButton } from '@mui/material'

interface LeftImageProps {
    image: string
}

const LeftImage: React.FC<LeftImageProps> = ({ image }) => {
    return (
        <div
            className={
                'flex-none bg-slate-300/50 shadow-slate-950/20 shadow-md ' +
                'min-w-[16rem] max-w-[36rem] w-full ' +
                'rounded-tl-3xl rounded-bl-lg rounded-br-3xl rounded-tr-3xl'
            }>
            <div className={'flex flex-row justify-center'}>
                <IconButton className={'w-full cursor-pointer'}>
                    <img
                        src={image}
                        alt={'Chat image'}
                        className={'max-h-[250px] max-w-[250px] object-cover w-full rounded-3xl'}
                    />
                </IconButton>
            </div>
        </div>
    )
}

export default LeftImage