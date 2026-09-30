import styles from './SectionTitle.module.css'

function SectionTitle({ eyebrow, title, description, align = 'left' }) {
	return (
		<div className={`${styles.title} ${align === 'center' ? styles.center : ''}`}>
			{eyebrow && <p className={styles.eyebrow}>{eyebrow}</p>}
			<h2>{title}</h2>
			{description && <p className={styles.description}>{description}</p>}
		</div>
	)
}

export default SectionTitle
