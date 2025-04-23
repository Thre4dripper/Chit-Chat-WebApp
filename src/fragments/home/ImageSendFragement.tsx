import React, { useRef, useState, useEffect } from 'react';
import {
    ReactCrop,
    Crop,
} from 'react-image-crop';
import Button from '@mui/material/Button';
import 'react-image-crop/dist/ReactCrop.css';
import SendIcon from '@mui/icons-material/Send';
import useChatDetailsStore from '../../store/chat.details.store';
import useLocalStore from '../../store/local.store';

interface ImageSendFragmentProps {
    image: string | null;
    cropShape: 'rect' | 'round';
    aspect: number;
    onConfirmed: () => void;
}

const ImageSendFragment: React.FC<ImageSendFragmentProps> = ({
                                                                 image,
                                                                 cropShape,
                                                                 aspect,
                                                                 onConfirmed,
                                                             }) => {
    const imgRef = useRef<HTMLImageElement | null>(null);
    const previewCanvasRef = useRef<HTMLCanvasElement | null>(null);
    const [crop, setCrop] = useState<Crop>({unit: '%', // can be 'px' or '%'
        x: 25,
        y: 25,
        width: 50,
        height: 50});

    const chatDetails = useChatDetailsStore((state) => state.chatDetails);
    const username = useLocalStore((state) => state.username);
    const sendImageMessage = useChatDetailsStore((state) => state.sendImageMessage);

    useEffect(() => {
        if (!crop || !imgRef.current || !previewCanvasRef.current) return;

        const canvas = previewCanvasRef.current;
        const image = imgRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const scaleX = image.naturalWidth / image.width;
        const scaleY = image.naturalHeight / image.height;

        const pixelRatio = window.devicePixelRatio;

        canvas.width = crop.width * pixelRatio;
        canvas.height = crop.height * pixelRatio;

        ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
        ctx.imageSmoothingQuality = 'high';

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.drawImage(
            image,
            crop.x * scaleX,
            crop.y * scaleY,
            crop.width * scaleX,
            crop.height * scaleY,
            0,
            0,
            crop.width,
            crop.height
        );
    }, [crop]);

    const handleConfirm = async () => {
        if (!chatDetails || !username || !previewCanvasRef.current) return;

        const to =
            chatDetails.dmChatUser1.username === username
                ? chatDetails.dmChatUser2.username
                : chatDetails.dmChatUser1.username;

        previewCanvasRef.current.toBlob((blob) => {
            if (blob) {
                const reader = new FileReader();
                reader.onloadend = () => {
                    const base64data = reader.result as string;
                    sendImageMessage(chatDetails, base64data, username, to); // now sending a string
                    onConfirmed();
                };
                reader.readAsDataURL(blob); // convert blob to base64 string
            }
        }, 'image/jpeg');
    };

    return (
        <div className='flex flex-col items-center gap-4'>
            {image && (
                <>
                    <ReactCrop
                        crop={crop}
                        onChange={(c) => setCrop(c)}
                        aspect={undefined}
                        circularCrop={cropShape === 'round'}>
                        <img
                            ref={imgRef}
                            src={image}
                            alt='To Crop'
                            className='max-w-full max-h-64'
                        />
                    </ReactCrop>
                    <canvas ref={previewCanvasRef} style={{ display: 'none' }} />

                    <Button
                        sx={{ float: 'right', position: 'absolute', bottom: '10px', right: '5px' }}
                        color='success'
                        onClick={handleConfirm}
                        endIcon={<SendIcon />}></Button>
                </>
            )}
        </div>
    )
};

export default ImageSendFragment;
