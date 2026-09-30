import { ArrowUpRight, GitBranch, Layers3 } from 'lucide-react'
import SectionTitle from '../../components/SectionTitle/SectionTitle.jsx'
import { projects } from '../../data/projects.js'
import styles from './Projects.module.css'

export function ProjectCard({ project }) {
	return (
		<article className={styles.card}>
			<div className={styles.preview}>
				{project.image ? <img src={project.image} alt={`${project.title} preview`} /> : <div className={styles.previewArt}><span className={styles.previewTop}><i /><i /><i /></span><span className={styles.previewPanel}><b /><b /><b /></span><span className={styles.previewChart} /></div>}
				{project.isExample && <span className={styles.example}>Concept</span>}
			</div>
			<div className={styles.cardBody}><div className={styles.cardHeading}><h3>{project.title}</h3><Layers3 size={17} /></div><p>{project.description}</p><div className={styles.tags}>{project.technologies.map((technology) => <span key={technology}>{technology}</span>)}</div><div className={styles.cardLinks}>{project.githubUrl ? <a href={project.githubUrl} target="_blank" rel="noreferrer"><GitBranch size={15} /> Source</a> : <span><GitBranch size={15} /> Link pending</span>}{project.liveUrl ? <a href={project.liveUrl} target="_blank" rel="noreferrer">Live project <ArrowUpRight size={15} /></a> : <span>Preview pending</span>}</div></div>
		</article>
	)
}

function Projects() {
	return <section className={styles.section} id="projects"><SectionTitle eyebrow="Selected work" title="Projects & experiments" description="Example concepts are shown for layout only. Replace these entries with shipped work and project links." /><div className={styles.grid}>{projects.map((project) => <ProjectCard key={project.id} project={project} />)}</div></section>
}

export default Projects
