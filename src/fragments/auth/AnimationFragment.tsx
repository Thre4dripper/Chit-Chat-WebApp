import React, { useCallback, useEffect, useRef, useState } from 'react'
import image from '../../assets/auth/signin_image.png'
import logo from '../../assets/logo.png'
import graphic from '../../assets/auth/signin-graphic.json'
import Lottie from 'lottie-react'
import Canvas from './Canvas.tsx'

const AnimationFragment: React.FC = () => {
    const [elementDegrees, setElementDegrees] = useState(0)
    const [previousDegrees, setPreviousDegrees] = useState(0)
    const [elementSpeed, setElementSpeed] = useState(0.002)
    const elementSpeedRef = useRef(elementSpeed)

    const parentRef = useRef<HTMLDivElement>(null)

    const parentWidth = parentRef.current?.clientWidth || 0
    const parentHeight = parentRef.current?.clientHeight || 0
    const { left, top, width, height } = parentRef.current?.getBoundingClientRect() || {
        left: 0,
        top: 0,
        width: 0,
        height: 0,
    }
    const radius = Math.min(parentWidth, parentHeight) / 10

    const { centerX, centerY } = {
        centerX: left + width / 2,
        centerY: top + height / 2,
    }

    const [mouseState, setMouseState] = useState({
        clicked: false,
        clickedX: 0,
        clickedY: 0,
    })

    const [rotationSpeed, setRotationSpeed] = useState(0)
    const rotationSpeedRef = useRef(rotationSpeed)

    const slowDown = useCallback(async () => {
        await new Promise((resolve) => setTimeout(resolve, 1000))
        setRotationSpeed((prevSpeed) => {
            const newSpeed = prevSpeed - (prevSpeed / 10) * 0.1
            if (Math.abs(newSpeed) < 0.001) {
                return 0
            } else {
                slowDown()
                return newSpeed
            }
        })
    }, [])

    const mouseFlickerTime = useRef(0)

    const handleMouseDown = useCallback(
        (e: React.MouseEvent<HTMLDivElement>) => {
            setMouseState((prev) => ({
                ...prev,
                clicked: true,
                clickedX: e.clientX,
                clickedY: e.clientY,
            }))
            setPreviousDegrees(elementDegrees)

            setRotationSpeed(0)

            mouseFlickerTime.current = Date.now()
        },
        [elementDegrees]
    )

    const handleMouseUp = useCallback(() => {
        setMouseState((prev) => ({ ...prev, clicked: false }))
        const elapsed = Date.now() - mouseFlickerTime.current

        const dx = elementDegrees - previousDegrees
        const speed = dx / elapsed
        setRotationSpeed(speed)

        slowDown().then()
    }, [elementDegrees, previousDegrees, slowDown])

    const handleMouseEnter = useCallback(() => {
        setElementSpeed(0)
    }, [])
    const handleMouseLeave = useCallback(() => {
        setElementSpeed(0.02)
        setMouseState((prev) => ({ ...prev, clicked: false }))
    }, [])

    const handleMouseMove = useCallback(
        (e: React.MouseEvent<HTMLDivElement>) => {
            if (!mouseState.clicked) return
            const { clientX, clientY } = e

            const dx = clientX - centerX
            const dy = clientY - centerY
            const angle =
                Math.atan2(dy, dx) -
                Math.atan2(mouseState.clickedY - centerY, mouseState.clickedX - centerX)
            const traversedDegrees = (angle * 180) / Math.PI

            setElementDegrees(previousDegrees + traversedDegrees)
        },
        [mouseState, centerX, centerY, previousDegrees]
    )

    useEffect(() => {
        elementSpeedRef.current = elementSpeed
        rotationSpeedRef.current = rotationSpeed
    }, [elementSpeed, rotationSpeed])

    useEffect(() => {
        const animate = () => {
            if (rotationSpeedRef.current !== 0) {
                setElementDegrees((prevDegrees) => prevDegrees + rotationSpeedRef.current)
            } else {
                setElementDegrees((prevDegrees) => prevDegrees + elementSpeedRef.current)
            }

            requestAnimationFrame(animate)
        }
        const animationId = requestAnimationFrame(animate)

        return () => cancelAnimationFrame(animationId)
    }, [mouseState, elementSpeed])

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

    return (
        <div
            className={'h-full w-full relative overflow-hidden flex justify-center items-center'}
            ref={parentRef}>
            <Canvas className={'absolute w-full h-full'} />
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
                    className={'shadow-2xl shadow-violet-900/40 rounded-full'}
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
            <div
                className={
                    'absolute w-full h-full bg-transparent cursor-grab active:cursor-grabbing'
                }
                onMouseMove={handleMouseMove}
                onMouseDown={handleMouseDown}
                onMouseUp={handleMouseUp}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            />
        </div>
    )
}

export default AnimationFragment
