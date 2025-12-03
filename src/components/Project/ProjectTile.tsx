import { useRef, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { MeshGradient } from '@paper-design/shaders-react'
import type { Project } from '../../types/project.types'
import perfectWorldLogo from '../../assets/logos/perfect-world-logo-black.png'
import { useTransitionStore } from '../../stores/transitionStore'

gsap.registerPlugin(ScrollTrigger)

interface ProjectTileProps {
    project: Project
    index: number
}

export default function ProjectTile({ project, index }: ProjectTileProps) {
    const navigate = useNavigate()
    const containerRef = useRef<HTMLDivElement>(null)
    const textRef = useRef<HTMLDivElement>(null)
    const logoRef = useRef<HTMLImageElement>(null)
    const [dimensions, setDimensions] = useState({ width: 100, height: 100 })

    useEffect(() => {
        if (containerRef.current) {
            setDimensions({
                width: containerRef.current.offsetWidth,
                height: containerRef.current.offsetHeight
            })
        }

        const handleResize = () => {
            if (containerRef.current) {
                setDimensions({
                    width: containerRef.current.offsetWidth,
                    height: containerRef.current.offsetHeight
                })
            }
        }

        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    useEffect(() => {
        if (!containerRef.current || !textRef.current || !logoRef.current) return

        const ctx = gsap.context(() => {
            // Text slides out to the left/right as we scroll past
            gsap.to(textRef.current, {
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: 'top center',
                    end: 'bottom top',
                    scrub: 1,
                },
                x: index % 2 === 0 ? -100 : 100,
                opacity: 0,
                ease: 'power1.inOut'
            })

            // Logo moves up slightly
            gsap.to(logoRef.current, {
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: 1,
                },
                y: -50,
                ease: 'none'
            })
        })

        return () => ctx.revert()
    }, [index])

    // Custom colors based on project theme or defaults
    const gradientColors = [
        project.theme.primaryColor,
        '#ffffff',
        project.theme.secondaryColor || '#000000',
        '#ffffff',
        project.theme.primaryColor
    ]

    return (
        <div
            ref={containerRef}
            className="relative w-full h-[440px] rounded-3xl overflow-hidden group"
        >
            <Link
                to={`/project/${project.slug}`}
                className="block w-full h-full"
                onClick={(e) => {
                    e.preventDefault()
                    if (containerRef.current) {
                        const rect = containerRef.current.getBoundingClientRect()
                        useTransitionStore.getState().startTransition({
                            clickPosition: { x: e.clientX, y: e.clientY },
                            rect: {
                                top: rect.top,
                                left: rect.left,
                                width: rect.width,
                                height: rect.height
                            },
                            color: project.theme.primaryColor,
                            gradientColors: [
                                project.theme.primaryColor,
                                '#ffffff',
                                project.theme.secondaryColor || '#000000',
                                '#ffffff',
                                project.theme.primaryColor
                            ],
                            projectSlug: project.slug,
                            source: 'list'
                        })

                        // Small delay to ensure state is set before navigation
                        setTimeout(() => {
                            navigate(`/project/${project.slug}`)
                        }, 10)
                    }
                }}
            >
                {/* Background Shader */}
                <div className="absolute inset-0 z-0">
                    <MeshGradient
                        width={dimensions.width}
                        height={dimensions.height}
                        colors={gradientColors}
                        distortion={1.2}
                        swirl={1.0}
                        speed={0.4}
                        grainMixer={0}
                    />
                </div>

                {/* Design Hands Overlay */}
                <div className="absolute inset-0 z-10 pointer-events-none">
                    <img
                        src="/assets/images/design hands clear.png"
                        alt=""
                        className="w-full h-full object-cover opacity-80 mix-blend-overlay"
                    />
                </div>

                {/* Content */}
                <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-8 text-center">
                    {/* Project Logo - Slides up */}
                    <div className="mb-8 transform transition-transform duration-500 group-hover:scale-110">
                        <img
                            ref={logoRef}
                            src={project.mission.partnerCharity.logo}
                            alt={`${project.name} logo`}
                            className="h-32 w-auto object-contain drop-shadow-2xl"
                        />
                    </div>

                    {/* Text Content - Slides out */}
                    <div ref={textRef} className="max-w-4xl">
                        <h2
                            className="text-5xl md:text-7xl font-bold text-black mb-8 drop-shadow-lg font-primary"
                        >
                            {project.name}
                        </h2>
                        <p className="text-2xl md:text-3xl text-black font-light drop-shadow-md leading-tight">
                            {project.tagline}
                        </p>

                        <div className="mt-12 flex items-center justify-center gap-4">
                            <span className="text-black/80 text-sm uppercase tracking-widest">In partnership with</span>
                            <img
                                src={perfectWorldLogo}
                                alt="Perfect World"
                                className="h-8 w-auto opacity-80"
                            />
                        </div>
                    </div>
                </div>
            </Link>
        </div>
    )
}
