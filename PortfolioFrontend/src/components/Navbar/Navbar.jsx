import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { ArrowUpRight, Menu, X } from 'lucide-react'
import { navigation } from '../../utils/constants.js'
import styles from './Navbar.module.css'

function Navbar() {
	const [isOpen, setIsOpen] = useState(false)

	return (
		<header className={styles.header}>
			<nav className={styles.nav} aria-label="Main navigation">
				<Link className={styles.brand} to="/" onClick={() => setIsOpen(false)}>
					<span className={styles.brandMark}>AS</span><span>ARSHLAN<span className={styles.brandDot}>.</span></span>
				</Link>
				<button className={styles.menuButton} type="button" aria-label={isOpen ? 'Close menu' : 'Open menu'} aria-expanded={isOpen} onClick={() => setIsOpen((open) => !open)}>
					{isOpen ? <X size={20} /> : <Menu size={20} />}
				</button>
				<div className={`${styles.links} ${isOpen ? styles.open : ''}`}>
					{navigation.map((item) => (
						<NavLink key={item.label} to={item.to} end={item.to === '/'} className={({ isActive }) => `${styles.link} ${isActive ? styles.active : ''}`} onClick={() => setIsOpen(false)}>
							{item.label}
						</NavLink>
					))}
					<Link className={styles.contactLink} to="/contact" onClick={() => setIsOpen(false)}>Let’s talk <ArrowUpRight size={15} /></Link>
				</div>
				<span className={styles.availability}><i /> Full Stack MERN</span>
			</nav>
		</header>
	)
}

export default Navbar
