import { ArrowUpRight, Flag } from 'lucide-react'
import SectionTitle from '../../components/SectionTitle/SectionTitle.jsx'
import { achievements } from '../../data/achievements.js'
import styles from '../Sections.module.css'

function Achievements() {
	return <section className={`${styles.section} ${styles.sectionMuted}`} id="achievements"><SectionTitle eyebrow="Highlights" title="Achievements" description="A space for meaningful milestones, added only when there is something concrete to share." />{achievements.length ? <div className={styles.simpleGrid}>{achievements.map((item) => <article className={styles.simpleCard} key={item.title}><Flag size={18} /><h3>{item.title}</h3><p>{item.description}</p>{item.url && <a href={item.url} target="_blank" rel="noreferrer">Read more <ArrowUpRight size={14} /></a>}</article>)}</div> : <div className={styles.emptyNote}><Flag size={17} /><span>No achievements listed yet.</span></div>}</section>
}

export default Achievements
