import { useState, useEffect } from 'react';
import { ArrowDownRight, ArrowUpRight, Code2, GitBranch, Link2, Mail, Download } from 'lucide-react';
import { Link } from 'react-router-dom';
import fallbackPortrait from '../../assets/hero2.jpg';
import portfolioService from '../../services/portfolioService.js';
import styles from './Hero.module.css';

function Hero() {
  const [profile, setProfile] = useState(null);
  const [portraitSrc, setPortraitSrc] = useState(fallbackPortrait);

  useEffect(() => {
    let isMounted = true;
    const fetchProfile = async () => {
      try {
        const res = await portfolioService.getPublicProfile();
        if (isMounted && res?.data?.profile) {
          setProfile(res.data.profile);
          if (res.data.profile.avatar) {
            setPortraitSrc(res.data.profile.avatar);
          }
        }
      } catch (err) {
        console.warn('Failed to fetch public profile for hero:', err);
      }
    };
    fetchProfile();
    return () => {
      isMounted = false;
    };
  }, []);

  const name = profile?.fullName || 'Arshlan Sheikh';
  const role = profile?.title || 'Full Stack Web Developer';
  const bio = profile?.bio || 'I build web experiences from the first interface to the data layer, with a focus on clear UX and dependable backend foundations.';
  const availability = profile?.availabilityStatus || 'Available';
  const availabilityNote = profile?.availabilityNote || 'Open to opportunities';

  // Find social links
  const github = profile?.socialLinks?.find((s) => s.platform.toLowerCase() === 'github')?.url || 'https://github.com/ArshlanSheikh';
  const linkedin = profile?.socialLinks?.find((s) => s.platform.toLowerCase() === 'linkedin')?.url || 'https://www.linkedin.com/in/arshlan-sheikh-b27114236';
  const email = profile?.email || 'arshlans29@gmail.com';
  const resumeUrl = profile?.resumeUrl || '/resume';

  return (
    <section className={styles.hero}>
      <div className={styles.inner}>
        <div className={styles.copy}>
          <p className={styles.kicker}>
            <span /> FULL STACK DEVELOPER <span className={styles.kickerLine} />
          </p>
          <h1>
            Hi, I’m<br />
            <span>{name}</span>
          </h1>
          <p className={styles.role}>{role}</p>
          <p className={styles.intro}>{bio}</p>

          <div className={styles.actions}>
            <a className="button buttonPrimary" href="#projects">
              View projects <ArrowDownRight size={16} />
            </a>
            <Link className="button buttonQuiet" to="/contact">
              Contact me <ArrowUpRight size={16} />
            </Link>
          </div>

          <div className={styles.socials}>
            <a href={github} target="_blank" rel="noreferrer">
              <GitBranch size={16} /> GitHub
            </a>
            <a href={linkedin} target="_blank" rel="noreferrer">
              <Link2 size={16} /> LinkedIn
            </a>
            <a href={`mailto:${email}`}>
              <Mail size={16} /> Email
            </a>
            {resumeUrl && (
              <a href={resumeUrl} target="_blank" rel="noreferrer">
                <Download size={16} /> Resume
              </a>
            )}
          </div>
        </div>

        <div className={styles.visual}>
          <div className={styles.portraitFrame}>
            <img
              className={styles.portrait}
              src={portraitSrc}
              alt={`Portrait of ${name}`}
              onError={() => setPortraitSrc(fallbackPortrait)}
            />
          </div>

          <div className={styles.codeCard}>
            <div className={styles.cardHeading}>
              <Code2 size={14} />
              <span>FULL STACK DEVELOPMENT</span>
              <i />
            </div>
            <p>
              From polished interfaces<br />
              to <strong>reliable APIs.</strong>
            </p>
            <div className={styles.stackTags}>
              <span>React</span>
              <span>Node.js</span>
              <span>Express</span>
              <span>MongoDB</span>
            </div>
          </div>

          <div className={styles.statusCard}>
            <span className={styles.statusDot} />
            <div>
              <strong>{availability}</strong>
              <small>{availabilityNote}</small>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.heroFoot}>
        <span>01 / 04</span>
        <span>
          Scroll to explore <ArrowDownRight size={14} />
        </span>
      </div>
    </section>
  );
}

export default Hero;
