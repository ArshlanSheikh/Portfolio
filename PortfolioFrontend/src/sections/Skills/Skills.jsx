import { Boxes, Braces, Database, Wrench } from 'lucide-react'
import SectionTitle from '../../components/SectionTitle/SectionTitle.jsx'
import { skillGroups } from '../../data/skills.js'
import styles from '../Sections.module.css'

const icons = [Braces, Boxes, Database, Wrench]

function Skills() {
	return (
		<section className={styles.section} id="skills">
			<SectionTitle eyebrow="Toolbox" title="Skills & technologies" description="A practical stack for building across the browser, server, and data layer." />
			<div className={styles.skillGrid}>{skillGroups.map((group, index) => {
				const Icon = icons[index]
				return <article className={styles.skillCard} key={group.name}><div className={styles.cardIcon}><Icon size={18} /></div><h3>{group.name}</h3><div className={styles.tags}>{group.items.map((skill) => <span key={skill}>{skill}</span>)}</div></article>
			})}</div>
		</section>
	)
}

export default Skills
