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

    // Drag tracking refs
    const isDraggingRef = useRef(false)
    const hasDraggedRef = useRef(false)
    const startXRef = useRef(0)
    const startRotationRef = useRef(0)
    const dragVelocityRef = useRef(0)
    const lastXRef = useRef(0)
    const lastTimeDragRef = useRef(0)

    // Responsive sizing based on window width
    useEffect(() => {
        const updateSizes = () => {
            const isMobile = window.innerWidth < 640
            const isTablet = window.innerWidth >= 640 && window.innerWidth < 1024

            if (isMobile) {
                setResponsiveSizes({
                    width: itemWidth * 0.6,
                    height: itemHeight * 0.6,
                    translateZ: translateZ * 0.45
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

    // Auto-rotation when not hovered, touching, or transitioning
    useEffect(() => {
        if ((pauseOnHover && isHovered) || isTouching || isTransitioning) {
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

            // Slow ambient rotation when idle (rotates clockwise/positive direction)
            const rotationIncrement = (360 / (rotateSpeed * 1000)) * deltaTime

            setRotation((prev) => prev + rotationIncrement)

            animationRef.current = requestAnimationFrame(animate)
        }

        animationRef.current = requestAnimationFrame(animate)

        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current)
                animationRef.current = undefined
            }
        }
    }, [isHovered, isTouching, isTransitioning, rotateSpeed, pauseOnHover])

    const handlePrevious = () => {
        if (isTransitioning) return
        setIsTransitioning(true)
        setRotation((prev) => prev + spreadAngle)
        setTimeout(() => setIsTransitioning(false), 600)
    }

    const handleNext = () => {
        if (isTransitioning) return
        setIsTransitioning(true)
        setRotation((prev) => prev - spreadAngle)
        setTimeout(() => setIsTransitioning(false), 600)
    }

    // Update isHovered based on hoveredIndex
    useEffect(() => {
        setIsHovered(hoveredIndex !== null)
    }, [hoveredIndex])

    // Pointer-based drag handlers
    const handlePointerDown = (e: React.PointerEvent) => {
        // Ignore if clicked on buttons or controls
        if ((e.target as HTMLElement).closest('button')) return

        if (e.button !== 0 && e.pointerType === 'mouse') return
        
        isDraggingRef.current = true
        setIsTouching(true)
        hasDraggedRef.current = false
        startXRef.current = e.clientX
        startRotationRef.current = rotation
        lastXRef.current = e.clientX
        lastTimeDragRef.current = performance.now()
        dragVelocityRef.current = 0
        
        e.currentTarget.setPointerCapture(e.pointerId)
    }

    const handlePointerMove = (e: React.PointerEvent) => {
        if (!isDraggingRef.current) return
        
        const deltaX = e.clientX - startXRef.current
        
        if (Math.abs(deltaX) > 5) {
            hasDraggedRef.current = true
        }

        const currentTime = performance.now()
        const deltaTime = currentTime - lastTimeDragRef.current
        
        const containerWidth = containerRef.current?.clientWidth || window.innerWidth
        const sensitivity = 180 / containerWidth
        const newRotation = startRotationRef.current + deltaX * sensitivity
        
        setRotation(newRotation)
        
        if (deltaTime > 0) {
            const instantDeltaX = e.clientX - lastXRef.current
            dragVelocityRef.current = (instantDeltaX * sensitivity) / (deltaTime / 1000)
        }
        
        lastXRef.current = e.clientX
        lastTimeDragRef.current = currentTime
    }

    const handlePointerUp = (e: React.PointerEvent) => {
        if (!isDraggingRef.current) return
        isDraggingRef.current = false
        setIsTouching(false)
        e.currentTarget.releasePointerCapture(e.pointerId)
        
        // Momentum and snapping to nearest index
        const velocityThreshold = 150
        let shift = 0
        if (Math.abs(dragVelocityRef.current) > velocityThreshold) {
            shift = Math.round(dragVelocityRef.current / 300)
            shift = Math.max(-1, Math.min(1, shift))
        }
        
        const nearestIndex = Math.round(-rotation / spreadAngle) - shift
        const snappedRotation = -nearestIndex * spreadAngle
        
        setIsTransitioning(true)
        setRotation(snappedRotation)
        setTimeout(() => setIsTransitioning(false), 600)
    }

    const handleClickCapture = (e: React.MouseEvent) => {
        if (hasDraggedRef.current) {
            e.preventDefault()
            e.stopPropagation()
        }
    }

    // Determine which item faces the front
    const rawIndex = Math.round(-rotation / spreadAngle) % totalItems
    const frontIndex = (rawIndex + totalItems) % totalItems

    return (
        <div
            ref={containerRef}
            className="w-full h-full relative overflow-visible select-none cursor-grab active:cursor-grabbing touch-none"
            style={{
                perspective: '1200px',
                zIndex: 0,
                pointerEvents: 'auto',
            }}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            onDragStart={(e) => e.preventDefault()}
            onClickCapture={handleClickCapture}
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
                        // Effective angle of this item relative to the viewer (0 = front)
                        const theta = (((angle + rotation) % 360) + 360) % 360
                        const depth = Math.cos((theta * Math.PI) / 180) // 1 front, -1 back
                        const depthT = (depth + 1) / 2
                        const scale = 0.72 + 0.28 * depthT
                        const opacity = 0.25 + 0.75 * depthT
                        const isFrontHalf = depth > 0.25
                        // Billboard: counter-rotate so the item always faces the viewer
                        const transform = `
            translate(-50%, -50%)
            rotateY(${angle}deg)
            translateZ(${responsiveSizes.translateZ}px)
            rotateY(${-(angle + rotation)}deg)
            scale(${scale})
          `

                        return (
                            <div
                                key={index}
                                className="absolute select-none"
                                style={{
                                    width: `${responsiveSizes.width}px`,
                                    height: `${responsiveSizes.height}px`,
                                    top: '50%',
                                    left: '50%',
                                    transform,
                                    opacity,
                                    transformOrigin: 'center center',
                                    overflow: 'visible',
                                    transition: isTransitioning
                                        ? 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.6s ease'
                                        : 'none',
                                    backfaceVisibility: showBackface ? 'visible' : 'hidden',
                                    borderRadius: `${borderRadius}px`,
                                    willChange: 'transform, opacity',
                                    // Only front items react to hover/clicks; rear items stay inert
                                    pointerEvents: isFrontHalf ? 'auto' : 'none',
                                    userSelect: 'none',
                                    WebkitUserSelect: 'none',
                                }}
                                onMouseEnter={() => setHoveredIndex(index)}
                                onMouseLeave={() => setHoveredIndex(null)}
                            >
                                {child}
                            </div>
                        )
                    })}
                </div>
            </div>

            {/* Controls: prev / current collection label / next */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-20 flex items-center gap-4 md:gap-8">
                <button
                    onClick={handlePrevious}
                    className="bg-black/5 hover:bg-black/10 backdrop-blur-sm p-3 rounded-full border border-black/10 transition-all hover:scale-110 active:scale-95"
                    aria-label="Previous collection"
                >
                    <ChevronLeft className="w-5 h-5 md:w-6 md:h-6 text-black" />
                </button>

                {labels.length > 0 && (
                    <div className="w-44 md:w-64 text-center">
                        <p className="text-base md:text-xl font-semibold text-gray-900 tracking-wide uppercase truncate transition-opacity duration-300">
                            {labels[frontIndex] ?? ''}
                        </p>
                        <p className="text-[11px] md:text-xs text-gray-500 mt-0.5">Tap to view collection</p>
                    </div>
                )}

                <button
                    onClick={handleNext}
                    className="bg-black/5 hover:bg-black/10 backdrop-blur-sm p-3 rounded-full border border-black/10 transition-all hover:scale-110 active:scale-95"
                    aria-label="Next collection"
                >
                    <ChevronRight className="w-5 h-5 md:w-6 md:h-6 text-black" />
                </button>
            </div>
        </div>
    )
}
