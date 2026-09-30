import { ArrowUpRight, BadgeCheck } from 'lucide-react'
import SectionTitle from '../../components/SectionTitle/SectionTitle.jsx'
import { certifications } from '../../data/certifications.js'
import styles from '../Sections.module.css'

function Certifications() {
	return <section className={styles.section} id="certifications"><SectionTitle eyebrow="Learning milestones" title="Certifications" description="Verified credentials will appear here when available." />{certifications.length ? <div className={styles.simpleGrid}>{certifications.map((item) => <article className={styles.simpleCard} key={item.name}><BadgeCheck size={18} /><h3>{item.name}</h3><p>{item.issuer} · {item.date}</p>{item.credentialUrl && <a href={item.credentialUrl} target="_blank" rel="noreferrer">View credential <ArrowUpRight size={14} /></a>}</article>)}</div> : <div className={styles.emptyNote}><BadgeCheck size={17} /><span>No certifications listed yet.</span></div>}</section>
}

export default Certifications
