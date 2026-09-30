import { useState } from 'react'
import { ArrowDownRight, ArrowUpRight, Code2, GitBranch, Link2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import fallbackPortrait from '../../assets/hero2.jpg'
import { profile } from '../../utils/constants.js'
import styles from './Hero.module.css'

function Hero() {
	const [portraitSrc, setPortraitSrc] = useState(profile.imageUrl)
	const [usingFallback, setUsingFallback] = useState(false)

	function handlePortraitError() {
		if (!usingFallback) {
			setPortraitSrc(fallbackPortrait)
			setUsingFallback(true)
		}
	}

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
				<div className={styles.visual}>
					<div className={styles.portraitFrame}>
						<img
							className={styles.portrait}
							src={portraitSrc}
							alt={`Portrait of ${profile.name}`}
							onError={handlePortraitError}
						/>
					</div>
					<div className={styles.codeCard}>
						<div className={styles.cardHeading}><Code2 size={14} /><span>FULL STACK DEVELOPMENT</span><i /></div>
						<p>From polished interfaces<br />to <strong>reliable APIs.</strong></p>
						<div className={styles.stackTags}><span>React</span><span>Node.js</span><span>MongoDB</span></div>
					</div>
					<div className={styles.statusCard}><span className={styles.statusDot} /><div><strong>Open to opportunities</strong><small>Building useful things for the web</small></div></div>
				</div>
			</div>
			<div className={styles.heroFoot}><span>01 / 04</span><span>Scroll to explore <ArrowDownRight size={14} /></span></div>
		</section>
	)
}

export default Hero
