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
            <div className="w-full">
                {slides.map((slide, index) => (
                    <div key={index} className="h-screen sticky top-0 bg-white/90 backdrop-blur-sm border-b border-gray-100 last:border-0">
                        <div className="container mx-auto px-4 h-full flex flex-col md:flex-row items-center justify-center gap-8 md:gap-20">
                            <motion.div
                                className="flex-1 space-y-8 max-w-xl"
                                initial={{ opacity: 0, x: -50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true, margin: "-20%" }}
                                transition={{ duration: 0.8 }}
                            >
                                <h2 className="text-5xl md:text-7xl font-bold tracking-tight uppercase leading-none">
                                    {slide.title}
                                </h2>
                                <p className="text-xl md:text-2xl text-gray-600 leading-relaxed">
                                    {slide.content}
                                </p>
                            </motion.div>

                            <motion.div
                                className="flex-1 w-full h-[50vh] md:h-[70vh] relative overflow-hidden rounded-2xl shadow-2xl"
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true, margin: "-20%" }}
                                transition={{ duration: 0.8, delay: 0.2 }}
                            >
                                <img
                                    src={slide.image}
                                    alt={slide.title}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-black/10" />
                            </motion.div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
