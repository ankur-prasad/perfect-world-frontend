import type { ReactNode } from 'react'
import { useRef, useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface Carousel3DProps {
    children: ReactNode[]
    rotateSpeed?: number
    pauseOnHover?: boolean
    translateZ?: number
    itemWidth?: number
    itemHeight?: number
    borderRadius?: number
    showBackface?: boolean
    labels?: string[]
}

export default function Carousel3D({
    children,
    rotateSpeed = 10,
    pauseOnHover = true,
    translateZ = 400,
    itemWidth = 350,
    itemHeight = 450,
    borderRadius = 16,
    showBackface = false,
    labels = [],
}: Carousel3DProps) {
    const totalItems = children.length
    const spreadAngle = 360 / totalItems
    const containerRef = useRef<HTMLDivElement>(null)
    const carouselRef = useRef<HTMLDivElement>(null)
    const [rotation, setRotation] = useState(0)
    const [isHovered, setIsHovered] = useState(false)
    const [isTransitioning, setIsTransitioning] = useState(false)
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
    const animationRef = useRef<number | undefined>(undefined)

    // Auto-rotation when not hovered
    useEffect(() => {
        if (pauseOnHover && isHovered) {
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
    }, [isHovered, rotateSpeed, pauseOnHover])

    const handlePrevious = () => {
        if (isTransitioning) return
        setIsTransitioning(true)
        setRotation((prev) => prev - spreadAngle)
        setTimeout(() => setIsTransitioning(false), 500)
    }

    const handleNext = () => {
        if (isTransitioning) return
        setIsTransitioning(true)
        setRotation((prev) => prev + spreadAngle)
        setTimeout(() => setIsTransitioning(false), 500)
    }

    const handleMouseLeave = () => {
        setIsHovered(false)
    }

    const handleMouseEnter = () => {
        setIsHovered(true)
    }

    return (
        <div
            ref={containerRef}
            className="w-full h-full relative overflow-visible select-none"
            style={{
                perspective: '1200px',
                zIndex: 0,
                pointerEvents: 'auto',
            }}
            onMouseLeave={handleMouseLeave}
            onMouseEnter={handleMouseEnter}
        >
            {/* Carousel wrapper with overflow hidden */}
            <div className="w-full h-full overflow-hidden absolute inset-0">
            <div
                ref={carouselRef}
                className="absolute top-1/2 left-1/2"
                style={{
                    transform: `translate(-50%, -50%) rotateY(${rotation}deg)`,
                    transformStyle: 'preserve-3d',
                    transformOrigin: 'center center',
                    transition: isTransitioning ? 'transform 0.5s ease-in-out' : 'transform 0.1s linear',
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
                            onMouseEnter={() => setHoveredIndex(index)}
                            onMouseLeave={() => setHoveredIndex(null)}
                        >
                            <div style={{
                                width: '100%',
                                height: '100%',
                                imageRendering: 'auto',
                                transform: 'translateZ(0)',
                                WebkitTransform: 'translateZ(0)',
                                position: 'relative',
                            }}>
                                {child}
                                {/* Label overlay on hover - bottom third only */}
                                {labels[index] && hoveredIndex === index && (
                                    <div
                                        className="absolute bottom-0 left-0 right-0 bg-black/40 backdrop-blur-lg flex items-center justify-center"
                                        style={{
                                            height: '33.33%',
                                            borderBottomLeftRadius: `${borderRadius}px`,
                                            borderBottomRightRadius: `${borderRadius}px`,
                                        }}
                                    >
                                        <p className="text-xl font-light text-white tracking-wide uppercase px-4">{labels[index]}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )
                })}
            </div>
            </div>

            {/* Arrow buttons - positioned outside carousel wrapper */}
            <button
                onClick={handlePrevious}
                className="absolute left-8 top-1/2 -translate-y-1/2 z-20 bg-black/5 hover:bg-black/10 backdrop-blur-sm p-4 rounded-full border border-black/10 transition-all hover:scale-110"
                aria-label="Previous"
            >
                <ChevronLeft className="w-6 h-6 text-black" />
            </button>
            <button
                onClick={handleNext}
                className="absolute right-8 top-1/2 -translate-y-1/2 z-20 bg-black/5 hover:bg-black/10 backdrop-blur-sm p-4 rounded-full border border-black/10 transition-all hover:scale-110"
                aria-label="Next"
            >
                <ChevronRight className="w-6 h-6 text-black" />
            </button>
        </div>
    )
}
