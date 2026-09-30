import { ArrowUpRight, Check, Code2, Compass, Layers3 } from 'lucide-react'
import { Link } from 'react-router-dom'
import SectionTitle from '../../components/SectionTitle/SectionTitle.jsx'
import { skillGroups } from '../../data/skills.js'
import styles from './About.module.css'

const principles = [
	{ icon: Compass, title: 'Start with the problem', text: 'Understand the user and the workflow before choosing a technical shape.' },
	{ icon: Layers3, title: 'Keep boundaries clear', text: 'Separate interface, application logic, and data responsibilities so each can evolve.' },
	{ icon: Check, title: 'Prefer useful simplicity', text: 'Make deliberate trade-offs and avoid adding complexity without a reason.' },
]

function About() {
	return (
		<div className={styles.page}>
			<header className={styles.pageHero}><p className={styles.eyebrow}>ABOUT / 02</p><h1>Building with curiosity<br /><span>and a full-stack view.</span></h1><p>I’m Arshlan Sheikh, a Full Stack MERN Developer working across interfaces, APIs, and data-driven features.</p></header>
			<section className={styles.background}><div className={styles.sectionLabel}>BACKGROUND</div><div><SectionTitle title="One product, end to end." /><p className={styles.body}>My focus is the MERN stack: shaping clear React experiences, building Node.js and Express services, and designing MongoDB data models to support them. I’m also familiar with tools such as Redis, Cloudinary, Razorpay, and Shiprocket.</p><p className={styles.body}>I’m growing my craft by working through the full lifecycle of web products: from a useful first screen to the details that make an application reliable and maintainable.</p><Link className={styles.inlineLink} to="/contact">Have a project to discuss? <ArrowUpRight size={15} /></Link></div></section>
			<section className={styles.principles}><SectionTitle eyebrow="How I work" title="A thoughtful build process." description="A few principles I bring to product and engineering work." /><div className={styles.principleGrid}>{principles.map(({ icon: Icon, title, text }) => <article key={title}><Icon size={20} /><h3>{title}</h3><p>{text}</p></article>)}</div></section>
			<section className={styles.techSection}><div><p className={styles.eyebrow}>CURRENT TOOLKIT</p><h2>Technologies I work with</h2></div><div className={styles.techGroups}>{skillGroups.map((group) => <div key={group.name}><h3>{group.name}</h3><p>{group.items.join(' · ')}</p></div>)}</div></section>
			<section className={styles.goals}><Code2 size={20} /><div><p className={styles.eyebrow}>LOOKING AHEAD</p><h2>Growing through meaningful product work.</h2><p>I’m focused on strengthening my engineering fundamentals, learning from collaborative teams, and contributing to software that solves real user problems.</p></div></section>
			<div className={styles.aboutCta}><span>Want to know more?</span><Link className="button buttonPrimary" to="/contact">Let’s talk <ArrowUpRight size={15} /></Link></div>
		</div>
	)
}

export default About
