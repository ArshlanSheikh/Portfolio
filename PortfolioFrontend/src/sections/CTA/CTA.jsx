import { ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import styles from '../Sections.module.css'

function CTA() {
	return <section className={styles.cta}><div><p>Have a project in mind?</p><h2>Let’s make the next useful thing.</h2></div><Link className="button buttonPrimary" to="/contact">Discuss a project <ArrowUpRight size={16} /></Link></section>
}

export default CTA
