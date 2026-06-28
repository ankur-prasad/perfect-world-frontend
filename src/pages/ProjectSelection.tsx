import { projects } from '../data/projects'
import Navigation from '../components/Layout/Navigation'
import Footer from '../components/Layout/Footer'
import ProjectTile from '../components/Project/ProjectTile'

export default function ProjectSelection() {
    return (
        <div className="min-h-screen bg-black text-white">
            <Navigation isDarkContent={false} />

            <div className="pt-12 md:pt-44 pb-20 px-4 flex justify-center">
                <div className="w-full max-w-[1200px]">
                    <h1 className="text-5xl md:text-7xl font-bold text-center py-6" style={{ fontFamily: '"Shadows Into Light", "Indie Flower", cursive' }}>Our Projects</h1>

                    {/* Introduction Text */}
                    <div className="text-center mb-8">
                        <h2 className="text-2xl md:text-3xl font-bold mb-6 py-2.5" style={{ fontFamily: '"Shadows Into Light", "Indie Flower", cursive' }}>Charities and Causes we support</h2>
                        <p className="text-lg md:text-xl leading-relaxed font-secondary">
                            Together with our partner charities, Perfect World invites you to be a part of a movement that
                            transcends borders, bringing joy and support to those who need it the most. Explore our
                            collaborative products, knowing that each purchase contributes to the well-being and future of
                            the planet. Learn more about our individual charities below.
                        </p>
                    </div>

                    <div className="flex flex-col gap-[1.25rem]">
                        {projects.map((project, index) => (
                            <ProjectTile key={project.id} project={project} index={index} />
                        ))}
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    )
}
