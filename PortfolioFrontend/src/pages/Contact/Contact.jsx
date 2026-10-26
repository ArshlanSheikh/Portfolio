import { useState, useEffect } from 'react';
import { ArrowUpRight, CheckCircle2, Mail, MapPin, Phone, Send, Loader2, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import portfolioService from '../../services/portfolioService.js';
import styles from './Contact.module.css';

function Contact() {
  const [profile, setProfile] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    inquiryType: 'Project Consultation',
    subject: '',
    message: '',
    _gotcha: '', // Hidden Honeypot
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // 'success' | 'error' | null
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    let isMounted = true;
    const fetchProfile = async () => {
      try {
        const res = await portfolioService.getPublicProfile();
        if (isMounted && res?.data?.profile) {
          setProfile(res.data.profile);
        }
      } catch (err) {
        console.warn('Failed to load profile details for contact page:', err);
      }
    };
    fetchProfile();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);
    setErrorMessage('');

    // Client-side quick checks
    if (!formData.name.trim() || !formData.email.trim() || !formData.subject.trim() || !formData.message.trim()) {
      setErrorMessage('Please fill in all required fields (Name, Email, Subject, and Message).');
      setSubmitStatus('error');
      setIsSubmitting(false);
      return;
    }

    if (formData.message.trim().length < 10) {
      setErrorMessage('Message must be at least 10 characters long.');
      setSubmitStatus('error');
      setIsSubmitting(false);
      return;
    }

    try {
      const res = await portfolioService.submitInquiry(formData);
      if (res?.success) {
        setSubmitStatus('success');
        setFormData({
          name: '',
          email: '',
          company: '',
          inquiryType: 'Project Consultation',
          subject: '',
          message: '',
          _gotcha: '',
        });
      } else {
        throw new Error(res?.message || 'Submission failed');
      }
    } catch (err) {
      setErrorMessage(
        err.message || 'Unable to deliver inquiry right now. Please check your connection or email directly.'
      );
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const email = profile?.email || 'arshlans29@gmail.com';
  const phone = profile?.phone || '+91 98765 43210';
  const location = profile?.location || 'New Delhi, India';

  return (
    <div className={styles.page}>
      <header className={styles.heading}>
        <p className={styles.eyebrow}>GET IN TOUCH</p>
        <h1>
          Let’s discuss<br />
          <span>what you’re building.</span>
        </h1>
        <p>Whether you need a full-stack platform, API architecture, or technical consultation, send a note below.</p>
      </header>

      <div className={styles.columns}>
        <section className={styles.formPanel}>
          <div className={styles.panelHeading}>
            <h2>Send an Inquiry</h2>
            <span>Direct to developer inbox</span>
          </div>

          {submitStatus === 'success' && (
            <div className={styles.success} role="status">
              <CheckCircle2 size={18} style={{ color: '#10b981', flexShrink: 0 }} />
              <div>
                <strong>Thank you! Your message has been sent successfully.</strong>
                <p style={{ margin: '4px 0 0', color: '#cbd5e1', fontSize: '12px' }}>
                  I typically respond within 24–48 business hours.
                </p>
              </div>
            </div>
          )}

          {submitStatus === 'error' && (
            <div className={styles.errorSummary} role="alert" style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
              <AlertCircle size={16} style={{ color: '#f87171', flexShrink: 0 }} />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            {/* Anti-spam Honeypot Trap (Hidden from genuine visitors) */}
            <input
              type="text"
              name="_gotcha"
              value={formData._gotcha}
              onChange={handleChange}
              style={{ display: 'none' }}
              tabIndex="-1"
              autoComplete="off"
            />

            <div className={styles.fieldGrid}>
              <div className={styles.field}>
                <label className={styles.label} htmlFor="name">
                  Full Name <span>*</span>
                </label>
                <input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Jane Doe"
                  required
                />
              </div>

              <div className={styles.field}>
                <label className={styles.label} htmlFor="email">
                  Email Address <span>*</span>
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="jane@company.com"
                  required
                />
              </div>
            </div>

            <div className={styles.fieldGrid}>
              <div className={styles.field}>
                <label className={styles.label} htmlFor="company">
                  Company / Organization
                </label>
                <input
                  id="company"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  placeholder="Acme Corp (optional)"
                />
              </div>

              <div className={styles.field}>
                <label className={styles.label} htmlFor="inquiryType">
                  Inquiry Type
                </label>
                <select
                  id="inquiryType"
                  name="inquiryType"
                  value={formData.inquiryType}
                  onChange={handleChange}
                >
                  <option value="Project Consultation">Project Consultation</option>
                  <option value="Freelance Work">Freelance Work</option>
                  <option value="Full-time Opportunity">Full-time Opportunity</option>
                  <option value="Mentorship">Mentorship</option>
                  <option value="General Inquiry">General Inquiry</option>
                </select>
              </div>
            </div>

            <label className={styles.label} htmlFor="subject">
              Subject <span>*</span>
            </label>
            <input
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              placeholder="e.g. New Web Application Architecture"
              required
            />

            <label className={styles.label} htmlFor="message">
              Project Details or Message <span>*</span>
            </label>
            <textarea
              id="message"
              name="message"
              rows="5"
              value={formData.message}
              onChange={handleChange}
              placeholder="Tell me about your project, timeline, target features, or goals…"
              required
            />

            <button className="button buttonPrimary" type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 size={16} className="globalSpinner" style={{ width: 14, height: 14 }} /> Sending message…
                </>
              ) : (
                <>
                  Send Inquiry <Send size={15} />
                </>
              )}
            </button>
          </form>
        </section>

        <aside className={styles.aside}>
          <div>
            <p className={styles.eyebrow}>DIRECT CONTACT</p>
            <h2>Let’s connect.</h2>
            <p className={styles.asideCopy}>
              Whether you have an immediate opening or want to collaborate on a new initiative, feel free to reach out directly.
            </p>
          </div>

          <div className={styles.contactItems}>
            <ContactItem icon={Mail} label="Email" value={email} href={`mailto:${email}`} />
            <ContactItem icon={Phone} label="Phone" value={phone} href={`tel:${phone}`} />
            <ContactItem icon={MapPin} label="Location" value={location} />
          </div>

          <div className={styles.asideBottom}>
            <span>Looking for projects?</span>
            <Link to="/#projects">
              Explore portfolio case studies <ArrowUpRight size={14} />
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}

function ContactItem({ icon: Icon, label, value, href }) {
  return (
    <div className={styles.contactItem}>
      <span>
        <Icon size={17} />
      </span>
      <div>
        <p>{label}</p>
        {href ? (
          <a href={href} style={{ color: '#d5ddd6', textDecoration: 'none', fontSize: '12px', fontWeight: 500 }}>
            {value}
          </a>
        ) : (
          <strong>{value}</strong>
        )}
      </div>
    </div>
  );
}

export default Contact;
