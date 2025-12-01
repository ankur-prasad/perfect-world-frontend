import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { projects } from '../data/projects'
import Navigation from '../components/Layout/Navigation'
import Footer from '../components/Layout/Footer'

export default function ProjectSelection() {
    return (
        <div className="min-h-screen bg-black text-white">
            <Navigation isDarkContent={false} />

            <div className="pt-32 pb-20 px-4 flex justify-center">
                <div className="w-full max-w-[1200px]">
                    <h1 className="text-5xl md:text-7xl font-bold text-center mb-20 font-primary">Our Projects</h1>

                    <div className="space-y-20">
                        {projects.map((project) => (
                            <motion.div
                                key={project.id}
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6 }}
                                className="relative group"
                            >
                                <Link to={`/project/${project.slug}`} className="block relative aspect-[21/9] overflow-hidden rounded-3xl">
                                    <img
                                        src={project.mission.heroImage}
                                        alt={project.name}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors" />

                                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8">
                                        <h2 className="text-4xl md:text-6xl font-bold mb-4">{project.name}</h2>
                                        <p className="text-xl md:text-2xl text-gray-200 max-w-2xl">{project.tagline}</p>

                                        <div className="mt-8 px-12 py-4 bg-white text-black rounded-full font-semibold opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                                            View Mission
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    )
}
