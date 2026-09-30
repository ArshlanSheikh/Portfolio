import { ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { profile } from '../../utils/constants.js'
import styles from './Footer.module.css'

function Footer() {
	return (
		<footer className={styles.footer}>
			<div className={styles.inner}>
				<div><Link className={styles.brand} to="/">AS<span>.</span></Link><p>Thoughtful interfaces. Reliable systems.</p></div>
				<div className={styles.right}><span>© {new Date().getFullYear()} Arshlan Sheikh</span><Link to="/contact">Start a conversation <ArrowUpRight size={14} /></Link></div>
				{!profile.email && <span className={styles.note}>Contact details can be added when ready.</span>}
			</div>
		</footer>
	)
}

export default Footer
