import { projects } from '../data/projects'
import Navigation from '../components/Layout/Navigation'
import Footer from '../components/Layout/Footer'
import ProjectTile from '../components/Project/ProjectTile'

export default function ProjectSelection() {
    return (
        <div className="min-h-screen bg-black text-white">
            <Navigation isDarkContent={false} />

            <div className="pt-32 pb-20 px-4 flex justify-center">
                <div className="w-full max-w-[1200px]">
                    <h1 className="text-5xl md:text-7xl font-bold text-center mb-20 font-primary">Our Projects</h1>

                    <div className="space-y-40">
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
