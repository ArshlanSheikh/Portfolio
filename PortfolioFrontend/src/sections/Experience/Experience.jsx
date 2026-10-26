import { useState, useEffect } from 'react';
import { BriefcaseBusiness, ExternalLink, MapPin } from 'lucide-react';
import SectionTitle from '../../components/SectionTitle/SectionTitle.jsx';
import portfolioService from '../../services/portfolioService.js';
import styles from '../Sections.module.css';

const formatDate = (dateString) => {
  if (!dateString) return '';
  const d = new Date(dateString);
  return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
};

function Experience() {
  const [experiences, setExperiences] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchExperience = async () => {
      try {
        const res = await portfolioService.getPublicExperience();
        if (isMounted && res?.data?.experiences) {
          setExperiences(res.data.experiences);
        }
      } catch (err) {
        console.warn('Failed to fetch public experience:', err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };
    fetchExperience();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section className={`${styles.section} ${styles.sectionMuted}`} id="experience">
      <SectionTitle
        eyebrow="Path so far"
        title="Experience"
        description="A timeline of engineering roles, core responsibilities, and delivered projects."
      />

      {isLoading ? (
        <div className={styles.emptyNote}>
          <BriefcaseBusiness size={18} />
          <span>Loading experience from database...</span>
        </div>
      ) : experiences.length ? (
        <div className={styles.timeline}>
          {experiences.map((role) => {
            const start = formatDate(role.startDate);
            const end = role.isCurrent ? 'Present' : formatDate(role.endDate);
            const duration = `${start} — ${end}`;

            return (
              <article
                className={styles.timelineItem}
                key={role._id || `${role.company}-${role.position}`}
              >
                <span className={styles.timelineMark}>
                  <BriefcaseBusiness size={16} />
                </span>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                    <p className={styles.meta}>{duration}</p>
                    {role.employmentType && (
                      <span
                        style={{
                          fontSize: '11px',
                          color: '#00f2fe',
                          fontFamily: 'var(--mono)',
                          padding: '2px 8px',
                          borderRadius: '4px',
                          background: 'rgba(0, 242, 254, 0.08)',
                        }}
                      >
                        {role.employmentType}
                      </span>
                    )}
                    {role.location && (
                      <span style={{ fontSize: '12px', color: '#64748b', display: 'flex', alignItems: 'center', gap: 4 }}>
                        <MapPin size={12} /> {role.location}
                      </span>
                    )}
                  </div>

                  <h3>{role.position}</h3>
                  <p className={styles.company}>
                    {role.company}
                    {role.companyUrl && (
                      <a
                        href={role.companyUrl}
                        target="_blank"
                        rel="noreferrer"
                        style={{ marginLeft: 6, color: 'var(--muted)', display: 'inline-flex' }}
                      >
                        <ExternalLink size={12} />
                      </a>
                    )}
                  </p>

                  {role.responsibilities?.length > 0 && (
                    <ul style={{ margin: '8px 0 12px 18px', padding: 0, color: 'var(--muted)', fontSize: '13px', lineHeight: 1.6 }}>
                      {role.responsibilities.map((resp, i) => (
                        <li key={i}>{resp}</li>
                      ))}
                    </ul>
                  )}

                  {role.technologies?.length > 0 && (
                    <div className={styles.tags}>
                      {role.technologies.map((tech) => (
                        <span key={tech}>{tech}</span>
                      ))}
                    </div>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <div className={styles.emptyNote}>
          <BriefcaseBusiness size={17} />
          <span>No roles listed yet.</span>
        </div>
      )}
    </section>
  );
}

export default Experience;
