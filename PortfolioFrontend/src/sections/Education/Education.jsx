import { GraduationCap } from 'lucide-react'
import SectionTitle from '../../components/SectionTitle/SectionTitle.jsx'
import { education } from '../../data/education.js'
import styles from '../Sections.module.css'

function Education() {
	return <section className={styles.section} id="education"><SectionTitle eyebrow="Learning" title="Education" description="Academic details can be added here when you are ready to share them." />{education.length ? <div className={styles.timeline}>{education.map((item) => <article className={styles.timelineItem} key={`${item.institution}-${item.program}`}><span className={styles.timelineMark}><GraduationCap size={17} /></span><div><p className={styles.meta}>{item.duration}</p><h3>{item.program}</h3><p className={styles.company}>{item.institution}</p>{item.details && <p>{item.details}</p>}</div></article>)}</div> : <div className={styles.emptyNote}><GraduationCap size={17} /><span>No education details listed yet.</span></div>}</section>
}

export default Education
