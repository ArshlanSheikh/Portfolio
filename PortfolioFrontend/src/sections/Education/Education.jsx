import { useState, useEffect } from 'react';
import { GraduationCap, Award } from 'lucide-react';
import SectionTitle from '../../components/SectionTitle/SectionTitle.jsx';
import portfolioService from '../../services/portfolioService.js';
import styles from '../Sections.module.css';

const formatYear = (dateString) => {
  if (!dateString) return '';
  return new Date(dateString).getFullYear();
};

function Education() {
  const [educations, setEducations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchEducation = async () => {
      try {
        const res = await portfolioService.getPublicEducation();
        if (isMounted && res?.data?.educations) {
          setEducations(res.data.educations);
        }
      } catch (err) {
        console.warn('Failed to fetch public education:', err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };
    fetchEducation();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section className={styles.section} id="education">
      <SectionTitle
        eyebrow="Learning & Foundations"
        title="Education"
        description="Formal academic degrees and foundational software engineering studies."
      />

      {isLoading ? (
        <div className={styles.emptyNote}>
          <GraduationCap size={18} />
          <span>Loading education from database...</span>
        </div>
      ) : educations.length ? (
        <div className={styles.timeline}>
          {educations.map((item) => {
            const start = formatYear(item.startDate);
            const end = item.isCurrent ? 'Present' : formatYear(item.endDate);
            const duration = start ? `${start} — ${end}` : '';

            return (
              <article
                className={styles.timelineItem}
                key={item._id || `${item.institution}-${item.degree}`}
              >
                <span className={styles.timelineMark}>
                  <GraduationCap size={17} />
                </span>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                    <p className={styles.meta}>{duration}</p>
                    {item.grade && (
                      <span
                        style={{
                          fontSize: '11px',
                          color: '#10b981',
                          fontFamily: 'var(--mono)',
                          padding: '2px 8px',
                          borderRadius: '4px',
                          background: 'rgba(16, 185, 129, 0.08)',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 4,
                        }}
                      >
                        <Award size={11} /> {item.grade}
                      </span>
                    )}
                  </div>

                  <h3>{item.degree} — {item.fieldOfStudy}</h3>
                  <p className={styles.company}>{item.institution}</p>
                  {item.description && <p>{item.description}</p>}
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <div className={styles.emptyNote}>
          <GraduationCap size={17} />
          <span>No education details listed yet.</span>
        </div>
      )}
    </section>
  );
}

export default Education;
