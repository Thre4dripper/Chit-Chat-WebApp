import React from 'react'
import lottieLoading from '../assets/lottie/loading.json'
import Lottie from 'lottie-react'

const LottieLoading: React.FC = () => {
    return (
        <div className={'w-screen h-screen flex justify-center items-center'}>
            <Lottie
                className={'max-h-[200px] max-w-[200px] '}
                animationData={lottieLoading}
                loop={true}
                autoPlay={true}
            />
        </div>
    )
}

export default LottieLoading
