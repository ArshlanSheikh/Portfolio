import { ArrowDownRight, ArrowUpRight, Code2, GitBranch, Link2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { profile } from '../../utils/constants.js'
import styles from './Hero.module.css'

function Hero() {
	return (
		<section className={styles.hero}>
			<div className={styles.inner}>
				<div className={styles.copy}>
					<p className={styles.kicker}><span /> FULL STACK DEVELOPER <span className={styles.kickerLine} /></p>
					<h1>Hi, I’m<br /><span>Arshlan Sheikh</span></h1>
					<p className={styles.role}>{profile.role}</p>
					<p className={styles.intro}>I build web experiences from the first interface to the data layer, with a focus on clear UX and dependable backend foundations.</p>
					<div className={styles.actions}>
						<a className="button buttonPrimary" href="#projects">View projects <ArrowDownRight size={16} /></a>
						<Link className="button buttonQuiet" to="/contact">Contact me <ArrowUpRight size={16} /></Link>
					</div>
					<div className={styles.socials}>
						<a href={profile.githubUrl || '#github-profile'} aria-disabled={!profile.githubUrl} onClick={(event) => !profile.githubUrl && event.preventDefault()}><GitBranch size={16} /> GitHub{!profile.githubUrl && <small>add URL</small>}</a>
						<a href={profile.linkedInUrl || '#linkedin-profile'} aria-disabled={!profile.linkedInUrl} onClick={(event) => !profile.linkedInUrl && event.preventDefault()}><Link2 size={16} /> LinkedIn{!profile.linkedInUrl && <small>add URL</small>}</a>
						<a href={profile.resumeUrl || '#resume'} aria-disabled={!profile.resumeUrl} onClick={(event) => !profile.resumeUrl && event.preventDefault()}><Code2 size={16} /> Resume{!profile.resumeUrl && <small>add file</small>}</a>
					</div>
				</div>
				<div className={styles.visual} aria-label="Code editor illustration">
					<div className={styles.editorBar}><span><i /><i /><i /></span><span>portfolio.config.js</span><Code2 size={15} /></div>
					<div className={styles.editorBody}>
						<div className={styles.line}><b>01</b><code><em>const</em> developer = {'{'}</code></div>
						<div className={styles.line}><b>02</b><code>&nbsp;&nbsp;name: <strong>"Arshlan Sheikh"</strong>,</code></div>
						<div className={styles.line}><b>03</b><code>&nbsp;&nbsp;role: <strong>"Full Stack MERN"</strong>,</code></div>
						<div className={styles.line}><b>04</b><code>&nbsp;&nbsp;focus: [</code></div>
						<div className={styles.line}><b>05</b><code>&nbsp;&nbsp;&nbsp;&nbsp;<strong>"Thoughtful UI"</strong>,</code></div>
						<div className={styles.line}><b>06</b><code>&nbsp;&nbsp;&nbsp;&nbsp;<strong>"Reliable APIs"</strong></code></div>
						<div className={styles.line}><b>07</b><code>&nbsp;&nbsp;],</code></div>
						<div className={styles.line}><b>08</b><code>{'}'}</code></div>
						<div className={styles.cursorLine}><span /></div>
					</div>
					<div className={styles.editorFooter}><span><i /> JavaScript</span><span>UTF-8</span><span>Ready to build</span></div>
					<div className={styles.orbit}><span>REACT</span><span>NODE</span><span>MONGO</span></div>
				</div>
			</div>
			<div className={styles.heroFoot}><span>01 / 04</span><span>Scroll to explore <ArrowDownRight size={14} /></span></div>
		</section>
	)
}

export default Hero
