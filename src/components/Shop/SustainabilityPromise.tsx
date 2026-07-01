import { motion } from 'framer-motion'

export default function SustainabilityPromise() {
    return (
        <section className="w-full py-8 px-4 sm:px-6 lg:px-8 bg-white flex justify-center">
            <div className="w-full max-w-[1200px] bg-[#0c0c0e] text-white rounded-3xl py-12 px-6 md:px-12 border border-zinc-800/80 shadow-2xl flex flex-col items-center">
                <div className="max-w-2xl text-center mb-10">
                    <motion.h2
                        className="text-2xl md:text-3xl lg:text-4xl font-medium text-white uppercase leading-tight mb-3 py-1"
                        style={{ fontFamily: '"Shadows Into Light", "Indie Flower", cursive' }}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        Sustainability Promise
                    </motion.h2>

                    <motion.p
                        className="text-sm md:text-base font-normal tracking-wide text-zinc-400 leading-relaxed"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        We use Stanley/Stella for their premium, ethically-made garments and commitment to a better planet. Their pieces are GOTS, OEKO-TEX, PETA-Approved Vegan, and Fair Wear Foundation certified — ensuring environmental responsibility and fair treatment of workers from seed to stitch.
                    </motion.p>
                </div>

                <motion.div 
                    className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 w-full"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                >
                    {/* GOTS Certified */}
                    <div className="bg-[#121214] border border-zinc-800/60 rounded-2xl p-6 md:p-8 flex flex-col items-center text-center justify-center hover:border-emerald-500/30 transition-all duration-300 group">
                        <div className="w-14 h-14 rounded-full bg-emerald-950/40 border border-emerald-800/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-[0_0_15px_rgba(16,185,129,0.05)] group-hover:shadow-[0_0_20px_rgba(16,185,129,0.15)]">
                            <svg className="w-6 h-6 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76z" />
                                <path d="m9 12 2 2 4-4" />
                            </svg>
                        </div>
                        <span className="font-bold text-base md:text-lg text-white mb-1 group-hover:text-emerald-400 transition-colors duration-300">GOTS Certified</span>
                        <span className="text-zinc-400 text-xs md:text-sm">100% Organic Cotton</span>
                    </div>

                    {/* OEKO-TEX */}
                    <div className="bg-[#121214] border border-zinc-800/60 rounded-2xl p-6 md:p-8 flex flex-col items-center text-center justify-center hover:border-blue-500/30 transition-all duration-300 group">
                        <div className="w-14 h-14 rounded-full bg-blue-950/40 border border-blue-800/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-[0_0_15px_rgba(59,130,246,0.05)] group-hover:shadow-[0_0_20px_rgba(59,130,246,0.15)]">
                            <svg className="w-6 h-6 text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M10 2v7.586a1 1 0 0 1-.293.707l-6.414 6.414a1 1 0 0 0-.293.707V20a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-2.586a1 1 0 0 0-.293-.707l-6.414-6.414a1 1 0 0 1-.293-.707V2z" />
                                <path d="M6 14h12" />
                            </svg>
                        </div>
                        <span className="font-bold text-base md:text-lg text-white mb-1 group-hover:text-blue-400 transition-colors duration-300">OEKO-TEX</span>
                        <span className="text-zinc-400 text-xs md:text-sm">Standard 100</span>
                    </div>

                    {/* PETA Approved */}
                    <div className="bg-[#121214] border border-zinc-800/60 rounded-2xl p-6 md:p-8 flex flex-col items-center text-center justify-center hover:border-rose-500/30 transition-all duration-300 group">
                        <div className="w-14 h-14 rounded-full bg-rose-950/40 border border-rose-800/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-[0_0_15px_rgba(244,63,94,0.05)] group-hover:shadow-[0_0_20px_rgba(244,63,94,0.15)]">
                            <svg className="w-6 h-6 text-rose-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                            </svg>
                        </div>
                        <span className="font-bold text-base md:text-lg text-white mb-1 group-hover:text-rose-400 transition-colors duration-300">PETA Approved</span>
                        <span className="text-zinc-400 text-xs md:text-sm">100% Vegan</span>
                    </div>

                    {/* Fair Wear */}
                    <div className="bg-[#121214] border border-zinc-800/60 rounded-2xl p-6 md:p-8 flex flex-col items-center text-center justify-center hover:border-amber-500/30 transition-all duration-300 group">
                        <div className="w-14 h-14 rounded-full bg-amber-950/40 border border-amber-800/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-[0_0_15px_rgba(245,158,11,0.05)] group-hover:shadow-[0_0_20px_rgba(245,158,11,0.15)]">
                            <svg className="w-6 h-6 text-amber-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M15 2H9a2 2 0 0 0-2 2v2H3a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h18a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-4V4a2 2 0 0 0-2-2z" />
                                <rect width="20" height="14" x="2" y="6" rx="2" />
                                <path d="M12 11h.01" />
                                <path d="M16 6V4a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v2" />
                            </svg>
                        </div>
                        <span className="font-bold text-base md:text-lg text-white mb-1 group-hover:text-amber-400 transition-colors duration-300">Fair Wear</span>
                        <span className="text-zinc-400 text-xs md:text-sm">Ethical Labor</span>
                    </div>
                </motion.div>
            </div>
        </section>
    )
}

