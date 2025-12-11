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
    const lastTimeRef = useRef<number>(0)
    const [responsiveSizes, setResponsiveSizes] = useState({ width: itemWidth, height: itemHeight, translateZ })
    const [isTouching, setIsTouching] = useState(false)

    // Responsive sizing based on window width
    useEffect(() => {
        const updateSizes = () => {
            const isMobile = window.innerWidth < 640
            const isTablet = window.innerWidth >= 640 && window.innerWidth < 1024

            if (isMobile) {
                setResponsiveSizes({
                    width: itemWidth * 0.65,
                    height: itemHeight * 0.65,
                    translateZ: translateZ * 0.6
                })
            } else if (isTablet) {
                setResponsiveSizes({
                    width: itemWidth * 0.8,
                    height: itemHeight * 0.8,
                    translateZ: translateZ * 0.8
                })
            } else {
                setResponsiveSizes({ width: itemWidth, height: itemHeight, translateZ })
            }
        }

        updateSizes()
        window.addEventListener('resize', updateSizes)
        return () => window.removeEventListener('resize', updateSizes)
    }, [itemWidth, itemHeight, translateZ])

    // Auto-rotation when not hovered or touching - improved with timestamp-based animation
    useEffect(() => {
        if ((pauseOnHover && isHovered) || isTouching) {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current)
                animationRef.current = undefined
            }
            return
        }

        lastTimeRef.current = performance.now()

        const animate = (currentTime: number) => {
            const deltaTime = currentTime - lastTimeRef.current
            lastTimeRef.current = currentTime

            // Calculate rotation increment based on actual time elapsed
            // This ensures smooth rotation regardless of frame rate
            const rotationIncrement = (360 / (rotateSpeed * 1000)) * deltaTime

            setRotation((prev) => {
                // Normalize rotation to prevent infinite accumulation
                const newRotation = (prev + rotationIncrement) % 360
                return newRotation
            })

            animationRef.current = requestAnimationFrame(animate)
        }

        animationRef.current = requestAnimationFrame(animate)

        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current)
                animationRef.current = undefined
            }
        }
    }, [isHovered, isTouching, rotateSpeed, pauseOnHover])

    const handlePrevious = () => {
        if (isTransitioning) return
        setIsTransitioning(true)
        setRotation((prev) => (prev - spreadAngle + 360) % 360)
        setTimeout(() => setIsTransitioning(false), 600)
    }

    const handleNext = () => {
        if (isTransitioning) return
        setIsTransitioning(true)
        setRotation((prev) => (prev + spreadAngle) % 360)
        setTimeout(() => setIsTransitioning(false), 600)
    }

    const handleMouseLeave = () => {
        setIsHovered(false)
    }

    const handleMouseEnter = () => {
        setIsHovered(true)
    }

    const handleTouchStart = () => {
        setIsTouching(true)
    }

    const handleTouchEnd = () => {
        setIsTouching(false)
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
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
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
                        transition: isTransitioning ? 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)' : 'none',
                        willChange: 'transform',
                    }}
                >
                    {children.map((child, index) => {
                        const angle = index * spreadAngle
                        const transform = `
            translate(-50%, -50%)
            rotateY(${angle}deg)
            translateZ(${responsiveSizes.translateZ}px)
          `

                        return (
                            <div
                                key={index}
                                className="absolute"
                                style={{
                                    width: `${responsiveSizes.width}px`,
                                    height: `${responsiveSizes.height}px`,
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

            {/* Arrow buttons - positioned below carousel */}
            <div className="absolute bottom-16 left-1/2 -translate-x-1/2 z-20 flex items-center gap-10">
                <button
                    onClick={handlePrevious}
                    className="bg-black/5 hover:bg-black/10 backdrop-blur-sm p-8 rounded-full border border-black/10 transition-all hover:scale-110"
                    aria-label="Previous"
                >
                    <ChevronLeft className="w-12 h-12 text-black" />
                </button>
                <button
                    onClick={handleNext}
                    className="bg-black/5 hover:bg-black/10 backdrop-blur-sm p-8 rounded-full border border-black/10 transition-all hover:scale-110"
                    aria-label="Next"
                >
                    <ChevronRight className="w-12 h-12 text-black" />
                </button>
            </div>
        </div>
    )
}
