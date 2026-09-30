import { BriefcaseBusiness } from 'lucide-react'
import SectionTitle from '../../components/SectionTitle/SectionTitle.jsx'
import { experience } from '../../data/experience.js'
import styles from '../Sections.module.css'

function Experience() {
	return (
		<section className={`${styles.section} ${styles.sectionMuted}`} id="experience">
			<SectionTitle eyebrow="Path so far" title="Experience" description="Professional experience will be added here when the details are ready to share." />
			{experience.length ? <div className={styles.timeline}>{experience.map((role) => <article className={styles.timelineItem} key={`${role.company}-${role.position}`}><span className={styles.timelineMark}><BriefcaseBusiness size={16} /></span><div><p className={styles.meta}>{role.duration}</p><h3>{role.position}</h3><p className={styles.company}>{role.company}</p><p>{role.description}</p><div className={styles.tags}>{role.technologies?.map((technology) => <span key={technology}>{technology}</span>)}</div></div></article>)}</div> : <div className={styles.emptyNote}><BriefcaseBusiness size={17} /><span>No roles listed yet.</span></div>}
		</section>
	)
}

export default Experience
