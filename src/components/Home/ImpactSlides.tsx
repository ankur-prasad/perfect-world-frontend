import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const slides = [
    {
        title: "All Profits Donated",
        content: "We believe in radical generosity. 100% of our profits go directly to the projects you choose. No overhead, no hidden fees. Just pure impact.",
        image: "https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?q=80&w=2070&auto=format&fit=crop"
    },
    {
        title: "Reason and Change",
        content: "The world is facing unprecedented challenges. We exist to bridge the gap between awareness and action, empowering you to be the catalyst for the change you wish to see.",
        image: "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?q=80&w=2070&auto=format&fit=crop"
    },
    {
        title: "Fashion as a Tool",
        content: "Clothing is more than just fabric; it's a statement. We use fashion as a vehicle to drive conversations, raise awareness, and fund tangible solutions for a better world.",
        image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2070&auto=format&fit=crop"
    }
];

export default function ImpactSlides() {
    const [activeSlide, setActiveSlide] = useState(0);

    return (
        <section className="bg-white text-black relative z-10">
            <div className="flex flex-col md:flex-row">
                {/* Left Column: Scrolling Text */}
                <div className="w-full md:w-1/2 relative z-10">
                    {slides.map((slide, index) => (
                        <motion.div
                            key={index}
                            className="h-screen flex flex-col justify-center px-6 md:px-20 max-w-3xl mx-auto"
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ amount: 0.5 }}
                            onViewportEnter={() => setActiveSlide(index)}
                        >
                            <div className="space-y-8">
                                <div className="flex items-center gap-4">
                                    <span className="text-sm font-mono text-gray-400">0{index + 1}</span>
                                    <div className={`h-px bg-gray-200 transition-all duration-500 ${activeSlide === index ? 'w-20 bg-black' : 'w-8'}`} />
                                </div>

                                <h2 className="text-5xl md:text-7xl font-bold tracking-tight uppercase leading-[0.9]">
                                    {slide.title}
                                </h2>
                                <p className="text-xl md:text-2xl text-gray-600 leading-relaxed">
                                    {slide.content}
                                </p>

                                {/* Mobile Image */}
                                <div className="md:hidden w-full h-[40vh] relative overflow-hidden rounded-2xl mt-8">
                                    <img
                                        src={slide.image}
                                        alt={slide.title}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Right Column: Sticky Image */}
                <div className="hidden md:block w-1/2 h-screen sticky top-0 overflow-hidden">
                    <div className="relative w-full h-full">
                        <AnimatePresence mode="popLayout">
                            {slides.map((slide, index) => (
                                activeSlide === index && (
                                    <motion.div
                                        key={index}
                                        className="absolute inset-0"
                                        initial={{ opacity: 0, scale: 1.1 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.7, ease: "easeInOut" }}
                                    >
                                        <img
                                            src={slide.image}
                                            alt={slide.title}
                                            className="w-full h-full object-cover"
                                        />
                                        <div className="absolute inset-0 bg-black/10" />
                                    </motion.div>
                                )
                            ))}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Mobile Image (Visible only on mobile, interspersed) */}
                {/* Note: For a true split layout on mobile, we usually just stack. 
                    But to keep the "sticky" feel, we might want to hide the sticky column and show images inline.
                    However, the current design hides the right column on mobile. 
                    Let's add inline images for mobile to ensure content is visible.
                */}
            </div>
        </section>
    );
}
