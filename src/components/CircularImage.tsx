import { Avatar, IconButton } from "@mui/material";
import React from "react";

interface CircularImageProps {
    image: string;
    size?: number;
}

const CircularImage: React.FC<CircularImageProps> = ({ image, size }) => {
    return (
        <div className={"flex flex-col justify-center"}>
            <IconButton>
                <Avatar src={image} sx={{ width: size, height: size }}/>
            </IconButton>
        </div>
    );
};

export default CircularImage;
