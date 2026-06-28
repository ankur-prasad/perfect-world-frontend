import { motion } from 'framer-motion'

export default function SustainabilityPromise() {
    return (
        <section className="flex items-center justify-center py-5 md:py-7 px-4 sm:px-6 lg:px-8 bg-white">
            <div className="max-w-2xl mx-auto text-center">
                <motion.h2
                    className="text-2xl md:text-3xl lg:text-4xl font-medium text-gray-900 uppercase leading-tight mb-2 md:mb-3 py-1"
                    style={{ fontFamily: '"Shadows Into Light", "Indie Flower", cursive' }}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    Sustainability Promise
                </motion.h2>

                <motion.p
                    className="text-sm md:text-base font-normal tracking-wide text-gray-500 leading-relaxed"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                >
                    We use Stanley/Stella for their premium, ethically-made garments and commitment to a better planet. Their pieces are GOTS, OEKO-TEX, PETA-Approved Vegan, and Fair Wear Foundation certified — ensuring environmental responsibility and fair treatment of workers from seed to stitch.
                </motion.p>
            </div>
        </section>
    )
}
