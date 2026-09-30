import { ArrowUpRight, CheckCircle2, Mail, MapPin, Phone, Send } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useContact } from '../../hooks/useContact.js'
import { profile } from '../../utils/constants.js'
import styles from './Contact.module.css'

function Contact() {
	const { values, errors, status, isSubmitting, updateField, submitForm } = useContact()

	return (
		<div className={styles.page}>
			<header className={styles.heading}><p className={styles.eyebrow}>CONTACT / 03</p><h1>Let’s talk about<br /><span>what you’re building.</span></h1><p>Share a little context and I’ll be glad to continue the conversation.</p></header>
			<div className={styles.columns}>
				<section className={styles.formPanel}>
					<div className={styles.panelHeading}><h2>Send a message</h2><span>Usually a few minutes to fill out</span></div>
					<form onSubmit={submitForm} noValidate>
						<div className={styles.fieldGrid}>
							<Field label="Name" name="name" value={values.name} error={errors.name} onChange={updateField} required />
							<Field label="Email" name="email" type="email" value={values.email} error={errors.email} onChange={updateField} required />
							<Field label="Phone" name="phone" type="tel" value={values.phone} onChange={updateField} />
							<Field label="Company" name="company" value={values.company} onChange={updateField} />
						</div>
						<label className={styles.label} htmlFor="service">What can I help with?</label>
						<select id="service" name="service" value={values.service} onChange={updateField}><option value="">Choose a service</option><option>Full stack web development</option><option>Frontend development</option><option>Backend or API development</option><option>Database integration</option><option>Something else</option></select>
						<label className={styles.label} htmlFor="message">Project details <span>*</span></label>
						<textarea id="message" name="message" rows="5" value={values.message} onChange={updateField} aria-invalid={Boolean(errors.message)} aria-describedby={errors.message ? 'message-error' : undefined} placeholder="A few details about your idea, timeline, or question…" required />
						{errors.message && <p className={styles.error} id="message-error">{errors.message}</p>}
						{status === 'error' && <p className={styles.errorSummary} role="alert">Check the highlighted fields and try again.</p>}
						{status === 'success' && <p className={styles.success} role="status"><CheckCircle2 size={17} /> Your details are valid. This demo does not send messages until the API is connected.</p>}
						<button className="button buttonPrimary" type="submit" disabled={isSubmitting}>{isSubmitting ? 'Checking…' : 'Validate message'} <Send size={15} /></button>
						<p className={styles.formNote}>No backend request is made from this form.</p>
					</form>
				</section>
				<aside className={styles.aside}>
					<div><p className={styles.eyebrow}>DIRECT DETAILS</p><h2>Keep it simple.</h2><p className={styles.asideCopy}>The best place to start is a short note about the problem you want to solve.</p></div>
					<div className={styles.contactItems}><ContactItem icon={Mail} label="Email" value={profile.email || 'Add your email address'} /><ContactItem icon={Phone} label="Phone" value={profile.phone || 'Add a contact number'} /><ContactItem icon={MapPin} label="Location" value={profile.location || 'Location not specified'} /></div>
					<div className={styles.asideBottom}><span>Prefer an introduction?</span><Link to="/about">Read about my approach <ArrowUpRight size={14} /></Link></div>
				</aside>
			</div>
		</div>
	)
}

function Field({ label, name, type = 'text', value, error, onChange, required = false }) {
	const errorId = `${name}-error`
	return <div className={styles.field}><label className={styles.label} htmlFor={name}>{label}{required && <span> *</span>}</label><input id={name} name={name} type={type} value={value} onChange={onChange} required={required} aria-invalid={Boolean(error)} aria-describedby={error ? errorId : undefined} autoComplete={name === 'name' ? 'name' : name === 'email' ? 'email' : name === 'phone' ? 'tel' : 'organization'} />{error && <p className={styles.error} id={errorId}>{error}</p>}</div>
}

function ContactItem({ icon: Icon, label, value }) {
	return <div className={styles.contactItem}><span><Icon size={17} /></span><div><p>{label}</p><strong>{value}</strong></div></div>
}

export default Contact
