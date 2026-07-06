import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

export default function ImpactSlides() {
    const { t } = useTranslation();

    const slides = [
        {
            title: t('impact.slide1Title'),
            content: t('impact.slide1Content'),
            image: "/assets/images/all-profits-donated.webp"
        },
        {
            title: t('impact.slide2Title'),
            content: t('impact.slide2Content'),
            image: "/assets/images/reason-for-change.webp"
        },
        {
            title: t('impact.slide3Title'),
            content: t('impact.slide3Content'),
            image: "/assets/images/fashion-as-a-tool.webp"
        }
    ];

    return (
        <section className="bg-white text-black relative z-10">
            {slides.map((slide, index) => (
                <div key={index} className="md:min-h-screen flex items-center justify-center relative overflow-hidden py-14 md:py-20">
                    <div className="w-full max-w-[1200px] px-6 md:px-24 lg:px-32">
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

                                <h2 className="title-handwritten py-3 md:mx-5">
                                    {slide.title}
                                </h2>
                                <p className="text-lg md:text-2xl text-gray-600 leading-relaxed max-w-xl md:mx-5">
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
                                        loading="lazy"
                                        decoding="async"
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
