import { Outlet } from 'react-router-dom'
import Navbar from '../components/Navbar/Navbar.jsx'
import Footer from '../components/Footer/Footer.jsx'
import styles from './MainLayout.module.css'

function MainLayout() {
	return <div className={styles.layout}><Navbar /><main><Outlet /></main><Footer /></div>
}

export default MainLayout
