import { Boxes, Braces, Database, Workflow } from 'lucide-react'
import SectionTitle from '../../components/SectionTitle/SectionTitle.jsx'
import { services } from '../../data/services.js'
import styles from '../Sections.module.css'

const icons = [Workflow, Braces, Boxes, Database]

function Services() {
	return <section className={styles.section} id="services"><SectionTitle eyebrow="How I can help" title="Services" description="Focused support for teams and founders building useful web products." /><div className={styles.serviceGrid}>{services.map((service, index) => { const Icon = icons[index]; return <article className={styles.serviceCard} key={service.title}><Icon size={19} className={styles.serviceIcon} /><h3>{service.title}</h3><p>{service.description}</p></article> })}</div></section>
}

export default Services
