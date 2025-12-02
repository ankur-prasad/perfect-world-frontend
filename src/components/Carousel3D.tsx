import type { ReactNode } from 'react'
import { useRef, useState, useEffect } from 'react'

interface Carousel3DProps {
    children: ReactNode[]
    rotateSpeed?: number
    pauseOnHover?: boolean
    translateZ?: number
    itemWidth?: number
    itemHeight?: number
    borderRadius?: number
    showBackface?: boolean
}

export default function Carousel3D({
    children,
    rotateSpeed = 25,
    pauseOnHover = true,
    translateZ = 400,
    itemWidth = 350,
    itemHeight = 450,
    borderRadius = 16,
    showBackface = false,
}: Carousel3DProps) {
    const totalItems = children.length
    const spreadAngle = 360 / totalItems
    const containerRef = useRef<HTMLDivElement>(null)
    const carouselRef = useRef<HTMLDivElement>(null)
    const [rotation, setRotation] = useState(0)
    const [isDragging, setIsDragging] = useState(false)
    const [isHovered, setIsHovered] = useState(false)
    const dragStartX = useRef(0)
    const dragStartRotation = useRef(0)
    const animationRef = useRef<number | undefined>()

    // Auto-rotation when not dragging
    useEffect(() => {
        if (isDragging || (pauseOnHover && isHovered)) {
            return
        }

        const animate = () => {
            setRotation((prev) => (prev + 360 / (rotateSpeed * 60)) % 360)
            animationRef.current = requestAnimationFrame(animate)
        }

        animationRef.current = requestAnimationFrame(animate)

        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current)
            }
        }
    }, [isDragging, isHovered, rotateSpeed, pauseOnHover])

    const handleMouseDown = (e: React.MouseEvent) => {
        setIsDragging(true)
        dragStartX.current = e.clientX
        dragStartRotation.current = rotation
    }

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDragging) return

        const deltaX = e.clientX - dragStartX.current
        const rotationDelta = deltaX * 0.5 // Sensitivity factor
        setRotation((dragStartRotation.current + rotationDelta) % 360)
    }

    const handleMouseUp = () => {
        setIsDragging(false)
    }

    const handleMouseLeave = () => {
        setIsDragging(false)
        setIsHovered(false)
    }

    const handleMouseEnter = () => {
        setIsHovered(true)
    }

    return (
        <div
            ref={containerRef}
            className="w-full h-full relative overflow-hidden select-none"
            style={{
                perspective: '1200px',
                zIndex: 0,
                pointerEvents: 'auto',
                cursor: isDragging ? 'grabbing' : 'grab',
            }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseLeave}
            onMouseEnter={handleMouseEnter}
        >
            <div
                ref={carouselRef}
                className="absolute top-1/2 left-1/2"
                style={{
                    transform: `translate(-50%, -50%) rotateY(${rotation}deg)`,
                    transformStyle: 'preserve-3d',
                    transformOrigin: 'center center',
                    transition: isDragging ? 'none' : 'transform 0.1s linear',
                }}
            >
                {children.map((child, index) => {
                    const angle = index * spreadAngle
                    const transform = `
            translate(-50%, -50%)
            rotateY(${angle}deg)
            translateZ(${translateZ}px)
          `

                    return (
                        <div
                            key={index}
                            className="absolute"
                            style={{
                                width: `${itemWidth}px`,
                                height: `${itemHeight}px`,
                                top: '50%',
                                left: '50%',
                                transform,
                                transformOrigin: 'center center',
                                overflow: 'visible',
                                transition: 'transform 0.5s ease',
                                backfaceVisibility: showBackface ? 'visible' : 'hidden',
                                borderRadius: `${borderRadius}px`,
                                willChange: 'transform',
                            }}
                        >
                            <div style={{
                                width: '100%',
                                height: '100%',
                                imageRendering: 'auto',
                                transform: 'translateZ(0)',
                                WebkitTransform: 'translateZ(0)',
                            }}>
                                {child}
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
