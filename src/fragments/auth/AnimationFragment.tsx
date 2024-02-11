import React, { useEffect, useRef, useState } from 'react'
import image from '../../assets/auth/signin_image.png'
import logo from '../../assets/logo.png'
import graphic from '../../assets/auth/signin-graphic.json'
import Lottie from 'lottie-react'

const AnimationFragment: React.FC = () => {
    const [elementDegrees, setElementDegrees] = useState(0)
    const [glassDivDegrees, setGlassDivDegrees] = useState(0)
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

            setElementDegrees((prevDegrees) => (prevDegrees + speed * elapsed) % 360)
            setGlassDivDegrees((prevDegrees) => (prevDegrees + (speed / 2) * elapsed) % 360)

            requestAnimationFrame(animate)
        }

        const animationId = requestAnimationFrame(animate)

        return () => cancelAnimationFrame(animationId)
    }, [speed])

    const angle = 45 // rotation angle in elementDegrees
    const rad = angle * (Math.PI / 180) // convert an angle to radians

    // image div
    const imageDivX = Math.cos(elementDegrees * (Math.PI / 180)) * radius
    const imageDivY = Math.sin(elementDegrees * (Math.PI / 180)) * radius * 1.6 - 30
    const rotatedImageDivX = imageDivX * Math.cos(rad) - imageDivY * Math.sin(rad)
    const rotatedImageDivY = imageDivX * Math.sin(rad) + imageDivY * Math.cos(rad)

    // logo div
    const logoDivX = Math.cos((elementDegrees + 120) * (Math.PI / 180)) * radius * 2
    const logoDivY = Math.sin((elementDegrees + 120) * (Math.PI / 180)) * radius * 3.2 - 30
    const rotatedLogoDivX = logoDivX * Math.cos(rad) - logoDivY * Math.sin(rad)
    const rotatedLogoDivY = logoDivX * Math.sin(rad) + logoDivY * Math.cos(rad)

    // lottie div
    const lottieDivX = Math.cos((elementDegrees + 240) * (Math.PI / 180)) * radius - 10
    const lottieDivY = Math.sin((elementDegrees + 240) * (Math.PI / 180)) * radius * 1.5 - 30
    const rotatedLottieDivX = lottieDivX * Math.cos(rad) - lottieDivY * Math.sin(rad)
    const rotatedLottieDivY = lottieDivX * Math.sin(rad) + lottieDivY * Math.cos(rad)

    const glass1DivX = Math.cos(glassDivDegrees * (Math.PI / 180)) * radius * 1.5
    const glass1DivY = Math.sin(glassDivDegrees * (Math.PI / 180)) * radius * 1.5 - 30

    const glass2DivX = Math.cos((glassDivDegrees + 120) * (Math.PI / 180)) * radius
    const glass2DivY = Math.sin((glassDivDegrees + 120) * (Math.PI / 180)) * radius - 30

    const glass3DivX = Math.cos((glassDivDegrees + 240) * (Math.PI / 180)) * radius * 2
    const glass3DivY = Math.sin((glassDivDegrees + 240) * (Math.PI / 180)) * radius * 2 - 30

    return (
        <div
            className={'h-full w-full relative overflow-hidden flex justify-center items-center'}
            ref={parentRef}>
            <div
                className={
                    'absolute bg-purple-500/50 shadow-xl shadow-purple-500 w-60 h-60 rounded-full'
                }
                style={{
                    left: '50%',
                    top: '50%',
                    transform: `translate(-50%, -50%) translate(${glass1DivX}%, ${glass1DivY}%)`, // Adjust a scale factor as needed
                }}
            />
            <div
                className={
                    'absolute bg-blue-500/30 shadow-xl shadow-blue-500 w-80 h-80 rounded-full'
                }
                style={{
                    left: '50%',
                    top: '50%',
                    transform: `translate(-50%, -50%) translate(${glass2DivX}%, ${glass2DivY}%)`, // Adjust a scale factor as needed
                }}
            />
            <div
                className={
                    'absolute bg-rose-500/20 shadow-xl shadow-rose-500 w-40 h-40 rounded-full'
                }
                style={{
                    left: '50%',
                    top: '50%',
                    transform: `translate(-50%, -50%) translate(${glass3DivX}%, ${glass3DivY}%)`, // Adjust a scale factor as needed
                }}
            />
            {/*Glass*/}
            <div
                className={'bg-gradient-to-r from-transparent from-95% to-white'}
                style={{
                    backdropFilter: 'blur(50px)',
                    width: '100%',
                    height: '100%',
                }}
            />
            {/*ellipse*/}
            <div
                className={
                    'absolute border-4 border-purple-300/30 border-dashed w-[24rem] h-[40rem]'
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
                        transform: `scale(${
                            0.4 * Math.sin(elementDegrees * (Math.PI / 180)) + 0.8
                        })`,
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
                            0.6 * Math.sin((elementDegrees + 120) * (Math.PI / 180)) + 1.5
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
                            0.6 * Math.sin((elementDegrees + 260) * (Math.PI / 180)) + 1
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
