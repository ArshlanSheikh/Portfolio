import { ArrowRight, MoveUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import SectionTitle from '../../components/SectionTitle/SectionTitle.jsx'
import Achievements from '../../sections/Achievements/Achievements.jsx'
import CTA from '../../sections/CTA/CTA.jsx'
import Certifications from '../../sections/Certifications/Certifications.jsx'
import Education from '../../sections/Education/Education.jsx'
import Experience from '../../sections/Experience/Experience.jsx'
import Hero from '../../sections/Hero/Hero.jsx'
import Projects from '../../sections/Projects/Projects.jsx'
import Services from '../../sections/Services/Services.jsx'
import Skills from '../../sections/Skills/Skills.jsx'
import Testimonials from '../../sections/Testimonials/Testimonials.jsx'
import styles from './Home.module.css'

function Home() {
	return (
		<>
			<Hero />
			<section className={styles.introBand}>
				<div className={styles.introInner}><span className={styles.index}>01 — INTRODUCTION</span><div><SectionTitle eyebrow="A little about me" title="From interface to infrastructure." /><p>I’m a Full Stack MERN Developer interested in building web products that feel considered and work reliably. My toolkit spans React interfaces, Node and Express APIs, and MongoDB data models.</p><Link to="/about" className={styles.textLink}>More about my approach <ArrowRight size={15} /></Link></div><span className={styles.stamp}>REACT<br />×<br />NODE</span></div>
			</section>
			<Skills />
			<Experience />
			<Projects />
			<Services />
			<Education />
			<div className={styles.pairedSections}><Certifications /><Achievements /></div>
			<Testimonials />
			<CTA />
			<div className={styles.adminLink}><Link to="/admin">Admin preview <MoveUpRight size={13} /></Link></div>
		</>
	)
}

export default Home
