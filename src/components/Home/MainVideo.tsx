import { useRef, useEffect } from 'react'

export default function MainVideo() {
    const videoRef = useRef<HTMLVideoElement>(null)

    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.play().catch(error => {
                console.log("Autoplay prevented:", error)
            })
        }
    }, [])

    return (
        <section className="w-full h-screen relative overflow-hidden bg-black">
            <div className="absolute inset-0 bg-black/40 z-10" /> {/* Overlay */}
            <video
                ref={videoRef}
                className="w-full h-full object-cover"
                autoPlay
                muted
                loop
                playsInline
                src="/assets/videos/WEB PROMO FINAL.mp4"
            />
        </section>
    )
}
