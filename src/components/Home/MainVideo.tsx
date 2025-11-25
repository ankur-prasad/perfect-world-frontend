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
                src="https://assets.mixkit.co/videos/preview/mixkit-waves-in-the-water-1164-large.mp4"
            />
            <div className="absolute inset-0 flex items-center justify-center z-20">
                <h2 className="text-white text-5xl md:text-7xl font-bold uppercase tracking-tighter text-center px-4 font-primary">
                    The World is Yours
                </h2>
            </div>
        </section>
    )
}
