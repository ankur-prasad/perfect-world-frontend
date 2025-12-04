import { useRef, useEffect, useState } from 'react'

export default function MainVideo() {
    const videoRef = useRef<HTMLVideoElement>(null)
    const [isPlaying, setIsPlaying] = useState(false)
    const [isMuted, setIsMuted] = useState(true)
    const [showControls, setShowControls] = useState(true)

    // Autoplay effect - runs only once on mount
    useEffect(() => {
        const video = videoRef.current
        if (!video) return

        const attemptPlay = () => {
            video.play()
                .catch(error => {
                    console.log("Autoplay prevented:", error)
                    setIsPlaying(false)
                })
        }

        if (video.readyState >= 3) {
            attemptPlay()
        } else {
            video.addEventListener('canplay', attemptPlay, { once: true })
        }

        return () => {
            video.removeEventListener('canplay', attemptPlay)
        }
    }, []) // Empty dependency array - run only once

    // Controls visibility effect - runs when playing state changes
    useEffect(() => {
        const hideTimer = setTimeout(() => {
            if (isPlaying) {
                setShowControls(false)
            }
        }, 3000)

        return () => clearTimeout(hideTimer)
    }, [isPlaying, showControls])

    const togglePlay = (e: React.MouseEvent) => {
        e.stopPropagation() // Prevent double triggering if clicking overlay
        const video = videoRef.current
        if (!video) {
            console.error("Video ref is null")
            return
        }

        console.log("Toggle play clicked. Current state:", video.paused ? "paused" : "playing")

        if (video.paused) {
            const playPromise = video.play()
            if (playPromise !== undefined) {
                playPromise
                    .then(() => {
                        console.log("Video started playing")
                    })
                    .catch(error => {
                        console.error("Play failed:", error)
                    })
            }
        } else {
            video.pause()
            console.log("Video paused")
        }
        setShowControls(true)
    }

    const toggleMute = (e: React.MouseEvent) => {
        e.stopPropagation()
        const video = videoRef.current
        if (!video) return

        video.muted = !video.muted
        setShowControls(true)
    }

    const handleMouseMove = () => {
        setShowControls(true)
    }

    return (
        <section
            className="w-full h-screen relative overflow-hidden bg-black cursor-pointer group"
            onMouseMove={handleMouseMove}
            onMouseLeave={() => isPlaying && setShowControls(false)}
        >
            <div
                className="absolute inset-0 bg-black/40 z-10 transition-opacity duration-300"
                style={{ opacity: isPlaying ? 0 : 0.4 }}
            />

            <video
                ref={videoRef}
                className="w-full h-full object-cover"
                muted
                loop
                playsInline
                src="/assets/videos/WEB%20PROMO%20FINAL.mp4"
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                onVolumeChange={(e) => setIsMuted(e.currentTarget.muted)}
            />

            {/* Video Controls */}
            <div
                className={`absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-4 transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0'
                    }`}
            >
                {/* Play/Pause Button */}
                <button
                    onClick={togglePlay}
                    className="flex items-center justify-center w-14 h-14 rounded-full bg-white/20 backdrop-blur-md hover:bg-white/30 transition-all duration-200 border border-white/30"
                    aria-label={isPlaying ? 'Pause video' : 'Play video'}
                >
                    {isPlaying ? (
                        // Pause Icon
                        <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                        </svg>
                    ) : (
                        // Play Icon
                        <svg className="w-6 h-6 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z" />
                        </svg>
                    )}
                </button>

                {/* Mute/Unmute Button */}
                <button
                    onClick={toggleMute}
                    className="flex items-center justify-center w-14 h-14 rounded-full bg-white/20 backdrop-blur-md hover:bg-white/30 transition-all duration-200 border border-white/30"
                    aria-label={isMuted ? 'Unmute video' : 'Mute video'}
                >
                    {isMuted ? (
                        // Muted Icon
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                        </svg>
                    ) : (
                        // Unmuted Icon
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                        </svg>
                    )}
                </button>
            </div>

            {/* Click overlay to play/pause */}
            <div
                className="absolute inset-0 z-[15]"
                onClick={togglePlay}
            />
        </section>
    )
}
