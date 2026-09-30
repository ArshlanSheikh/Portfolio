import { NavLink, Outlet } from 'react-router-dom'
import { Award, BriefcaseBusiness, GraduationCap, LayoutDashboard, LogOut, MessageSquareText, Settings2, Sparkles } from 'lucide-react'
import styles from './AdminLayout.module.css'

const items = [
	{ title: 'Overview', path: '/admin', icon: LayoutDashboard, end: true },
	{ title: 'Projects', path: '/admin/projects', icon: BriefcaseBusiness },
	{ title: 'Experience', path: '/admin/experience', icon: Settings2 },
	{ title: 'Skills', path: '/admin/skills', icon: Sparkles },
	{ title: 'Education', path: '/admin/education', icon: GraduationCap },
	{ title: 'Certifications', path: '/admin/certifications', icon: Award },
	{ title: 'Achievements', path: '/admin/achievements', icon: Sparkles },
	{ title: 'Inquiries', path: '/admin/inquiries', icon: MessageSquareText },
]

function AdminLayout() {
	return (
		<div className={styles.adminShell}>
			<aside className={styles.sidebar}>
				<a className={styles.brand} href="/admin"><span>AS</span><span>Portfolio CMS<small>ADMIN PREVIEW</small></span></a>
				<p className={styles.navLabel}>WORKSPACE</p>
				<nav aria-label="Admin navigation">{items.map(({ title, path, icon: Icon, end }) => <NavLink key={path} to={path} end={end} className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}><Icon size={17} />{title}</NavLink>)}</nav>
				<div className={styles.sidebarBottom}><a href="/" className={styles.publicLink}>View public site ↗</a><button type="button" disabled title="Connect authentication before enabling sign out"><LogOut size={16} />Sign out</button></div>
			</aside>
			<main className={styles.adminMain}><header className={styles.topbar}><span>Portfolio management</span><span className={styles.previewTag}>Backend not connected</span></header><div className={styles.content}><Outlet /></div></main>
		</div>
	)
}

export default AdminLayout
