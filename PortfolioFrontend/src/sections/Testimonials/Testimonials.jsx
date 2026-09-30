import { Quote } from 'lucide-react'
import SectionTitle from '../../components/SectionTitle/SectionTitle.jsx'
import { testimonials } from '../../data/testimonials.js'
import styles from '../Sections.module.css'

function Testimonials() {
	if (!testimonials.length) return null
	return <section className={styles.section} id="testimonials"><SectionTitle eyebrow="Kind words" title="Testimonials" description="Feedback shared with permission." /> <div className={styles.simpleGrid}>{testimonials.map((item) => <blockquote className={styles.simpleCard} key={item.name}><Quote size={18} /><p>“{item.quote}”</p><footer>{item.name}{item.role && ` · ${item.role}`}</footer></blockquote>)}</div></section>
}

export default Testimonials
