import React, { useEffect, useRef, useState } from 'react'
import image from '../../assets/auth/signin_image.png'
import logo from '../../assets/logo.png'
import graphic from '../../assets/auth/signin-graphic.json'
import Lottie from 'lottie-react'

const AnimationFragment: React.FC = () => {
    const [degrees, setDegrees] = useState(0)
    const lastTimestamp = useRef<number>(0)
    const parentRef = useRef<HTMLDivElement>(null)

    const parentWidth = parentRef.current?.clientWidth || 0
    const parentHeight = parentRef.current?.clientHeight || 0
    const radius = Math.min(parentWidth, parentHeight) / 10
    const speed = 0.03 // Adjust speed as needed

    useEffect(() => {
        const animate = (timestamp: number) => {
            if (!lastTimestamp.current) {
                lastTimestamp.current = timestamp
            }

            const elapsed = timestamp - lastTimestamp.current
            lastTimestamp.current = timestamp

            setDegrees((prevDegrees) => (prevDegrees + speed * elapsed) % 360)

            requestAnimationFrame(animate)
        }

        const animationId = requestAnimationFrame(animate)

        return () => cancelAnimationFrame(animationId)
    }, [speed])

    const angle = 45 // rotation angle in degrees
    const rad = angle * (Math.PI / 180) // convert an angle to radians

    // image div
    const imageDivX = Math.cos(degrees * (Math.PI / 180)) * radius
    const imageDivY = Math.sin(degrees * (Math.PI / 180)) * radius * 1.6 - 30
    const rotatedImageDivX = imageDivX * Math.cos(rad) - imageDivY * Math.sin(rad)
    const rotatedImageDivY = imageDivX * Math.sin(rad) + imageDivY * Math.cos(rad)

    // logo div
    const logoDivX = Math.cos((degrees + 120) * (Math.PI / 180)) * radius * 1.5
    const logoDivY = Math.sin((degrees + 120) * (Math.PI / 180)) * radius * 3.2 - 30
    const rotatedLogoDivX = logoDivX * Math.cos(rad) - logoDivY * Math.sin(rad)
    const rotatedLogoDivY = logoDivX * Math.sin(rad) + logoDivY * Math.cos(rad)

    // lottie div
    const lottieDivX = Math.cos((degrees + 240) * (Math.PI / 180)) * radius
    const lottieDivY = Math.sin((degrees + 240) * (Math.PI / 180)) * radius * 1.6 - 30
    const rotatedLottieDivX = lottieDivX * Math.cos(rad) - lottieDivY * Math.sin(rad)
    const rotatedLottieDivY = lottieDivX * Math.sin(rad) + lottieDivY * Math.cos(rad)
    return (
        <div
            className={'h-full w-full relative overflow-hidden flex justify-center items-center'}
            ref={parentRef}>
            {/*ellipse*/}
            <div
                className={
                    'absolute border-4 border-purple-30/50 border-dashed w-[24rem] h-[40rem]'
                }
                style={{
                    left: '50%',
                    top: 'calc(50% - 30px)',
                    borderRadius: '100% / 125% 125% 80%  80%',
                    transform: 'translate(-50%, -50%) rotate(45deg)',
                }}
            />
            {/* image div */}
            <div
                className={'absolute'}
                style={{
                    left: '50%',
                    top: '50%',
                    transform: `translate(-50%, -50%) translate(${rotatedImageDivX}%, ${rotatedImageDivY}%)`, // Adjust a scale factor as needed
                }}>
                <img
                    src={image}
                    alt='auth_ui_logo'
                    className={'w-60 h-60'}
                    style={{
                        transform: `scale(${0.4 * Math.sin(degrees * (Math.PI / 180)) + 0.8})`,
                    }}
                />
            </div>
            {/* logo div */}
            <div
                className={'absolute'}
                style={{
                    left: '50%',
                    top: '50%',
                    transform: `translate(-50%, -50%) translate(${rotatedLogoDivX}%, ${rotatedLogoDivY}%)`, // Adjust a scale factor as needed
                }}>
                <img
                    src={logo}
                    alt='logo'
                    style={{
                        width: '8rem',
                        height: '8rem',
                        transform: `scale(${
                            0.6 * Math.sin((degrees + 120) * (Math.PI / 180)) + 1.5
                        })`,
                    }}
                />
            </div>
            {/* lottie div */}
            <div
                className={'absolute'}
                style={{
                    left: '50%',
                    top: '50%',
                    transform: `translate(-50%, -50%) translate(${rotatedLottieDivX}%, ${rotatedLottieDivY}%)`, // Adjust a scale factor as needed
                }}>
                <Lottie
                    className={'w-60 h-60'}
                    style={{
                        transform: `scale(${
                            0.6 * Math.sin((degrees + 260) * (Math.PI / 180)) + 1
                        })`,
                    }}
                    animationData={graphic}
                    loop={true}
                    autoPlay={true}
                />
            </div>
        </div>
    )
}

export default AnimationFragment
