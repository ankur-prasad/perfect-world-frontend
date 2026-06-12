import { motion } from 'framer-motion';

const slides = [
    {
        title: "All Profits Donated",
        content: "A Brand built on creating tangible hope. With 100% of profits donated, Perfect World exists to help, not to exploit.",
        image: "/assets/images/all-profits-donated.webp"
    },
    {
        title: "Reason and Change",
        content: "We want to make a statement—a statement that combines style with a call for urgent change on our planet. Perfect World is about more than clothing; it’s a movement that uses fashion to advocate for a better, more compassionate world. With each purchase, we invite our customers to make that same statement, to wear their values proudly, and to join us in raising awareness for causes that matter. We are glad you are here, reading this :) let's make a difference, together.",
        image: "/assets/images/reason-for-change.webp"
    },
    {
        title: "Fashion as a Tool",
        content: "We believe in the power fashion holds to make a Statement. Giving you a voice, while simultaneously aiding and supporting charities on the forefront of our global challenges.",
        image: "/assets/images/fashion-as-a-tool.webp"
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

                                <h2 className="text-5xl md:text-7xl font-bold tracking-tight uppercase leading-[0.9]" style={{ fontFamily: '"Shadows Into Light", "Indie Flower", cursive', paddingTop: '15px', paddingBottom: '15px', marginLeft: '20px', marginRight: '20px', paddingLeft: '0px', paddingRight: '0px' }}>
                                    {slide.title}
                                </h2>
                                <p className="text-xl md:text-2xl text-gray-600 leading-relaxed max-w-xl" style={{ paddingTop: '0px', paddingBottom: '0px', marginLeft: '20px', marginRight: '20px' }}>
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
                                        style={{ marginLeft: '0px', marginRight: '0px', paddingLeft: '0px', paddingRight: '0px' }}
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
