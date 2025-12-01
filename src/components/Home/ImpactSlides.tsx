import { motion } from 'framer-motion';

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
    return (
        <section className="bg-white text-black relative z-10">
            {slides.map((slide, index) => (
                <div key={index} className="min-h-screen flex items-center justify-center relative overflow-hidden py-20">
                    <div className="w-full max-w-[1200px] px-12 md:px-24 lg:px-32">
                        <div className={`flex flex-col md:flex-row items-center gap-12 lg:gap-32 ${index % 2 === 1 ? 'md:flex-row-reverse' : ''
                            }`}>
                            {/* Text Column */}
                            <motion.div
                                className="w-full md:w-1/2 space-y-8"
                                initial={{ opacity: 0, y: 40 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-20%" }}
                                transition={{ duration: 0.8, ease: "easeOut" }}
                            >
                                <div className="flex items-center gap-4">
                                    <span className="text-sm font-mono text-gray-400">0{index + 1}</span>
                                    <div className="w-12 h-px bg-black" />
                                </div>

                                <h2 className="text-5xl md:text-7xl font-bold tracking-tight uppercase leading-[0.9]">
                                    {slide.title}
                                </h2>
                                <p className="text-xl md:text-2xl text-gray-600 leading-relaxed max-w-xl">
                                    {slide.content}
                                </p>
                            </motion.div>

                            {/* Image Column - Framed and Cropped */}
                            <motion.div
                                className="w-full md:w-1/2"
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true, margin: "-20%" }}
                                transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                            >
                                <div className="relative aspect-[4/3] rounded-[2.5rem] overflow-hidden shadow-2xl transform hover:scale-[1.02] transition-transform duration-700">
                                    <img
                                        src={slide.image}
                                        alt={slide.title}
                                        className="w-full h-full object-cover"
                                    />
                                    {/* Subtle overlay for depth */}
                                    <div className="absolute inset-0 bg-black/5 pointer-events-none" />
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>
            ))}
        </section>
    );
}
