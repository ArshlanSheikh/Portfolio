import { useState } from 'react'
import { ArrowLeft, LockKeyhole } from 'lucide-react'
import { Link } from 'react-router-dom'
import styles from './AuthLogin.module.css'

function AuthLogin() {
  const [notice, setNotice] = useState('')

  function handleSubmit(event) {
    event.preventDefault()
    setNotice('Authentication is not connected yet. No credentials were sent or stored.')
  }

  return <main className={styles.page}><Link className={styles.back} to="/"><ArrowLeft size={15} /> Back to portfolio</Link><section className={styles.panel}><span className={styles.icon}><LockKeyhole size={20} /></span><p className={styles.eyebrow}>ADMINISTRATION</p><h1>Sign in</h1><p className={styles.copy}>Admin authentication will be available after the backend is connected.</p><form onSubmit={handleSubmit}><label htmlFor="email">Email</label><input id="email" name="email" type="email" autoComplete="username" required /><label htmlFor="password">Password</label><input id="password" name="password" type="password" autoComplete="current-password" required /><button className="button buttonPrimary" type="submit">Continue</button></form>{notice && <p className={styles.notice} role="status">{notice}</p>}<p className={styles.note}>This screen does not authenticate users or store tokens.</p></section></main>
}

export default AuthLogin