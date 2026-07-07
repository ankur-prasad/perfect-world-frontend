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
            {slides.map((slide, index) => {
                return (
                    <div key={index} className="px-4 sm:px-6 md:px-8 py-6 md:py-10">
                        <motion.div
                            data-nav-theme="light"
                            className="group relative w-full max-w-[1600px] mx-auto overflow-hidden rounded-[1.75rem] md:rounded-[2.5rem] shadow-2xl min-h-[620px] md:min-h-[86vh]"
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-15%" }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                        >
                            {/* Full-bleed image */}
                            <img
                                src={slide.image}
                                alt={slide.title}
                                loading="lazy"
                                decoding="async"
                                className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105"
                            />

                            {/* Legibility scrim — bottom on mobile, left on desktop */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-black/10 md:hidden" />
                            <div className="absolute inset-0 hidden md:block bg-gradient-to-r from-black/80 via-black/25 to-transparent" />

                            {/* Overlaid text */}
                            <div className="absolute inset-0 flex items-end md:items-center md:justify-start p-8 sm:p-10 md:p-16 lg:p-24">
                                <motion.div
                                    className="w-full md:max-w-xl space-y-6 text-white"
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, margin: "-15%" }}
                                    transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                                >
                                    <div className="flex items-center gap-4">
                                        <span className="text-sm font-mono text-white/70">0{index + 1}</span>
                                        <div className="w-12 h-px bg-white/60" />
                                    </div>

                                    <h2 className="title-handwritten drop-shadow-lg">
                                        {slide.title}
                                    </h2>
                                    <p className="text-lg md:text-2xl text-white/90 leading-relaxed drop-shadow-md">
                                        {slide.content}
                                    </p>
                                </motion.div>
                            </div>
                        </motion.div>
                    </div>
                );
            })}
        </section>
    );
}
