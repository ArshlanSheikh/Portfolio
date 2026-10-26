import { useState, useEffect } from 'react';
import { Boxes, Braces, Database, Wrench, Sparkles, Star } from 'lucide-react';
import SectionTitle from '../../components/SectionTitle/SectionTitle.jsx';
import portfolioService from '../../services/portfolioService.js';
import styles from '../Sections.module.css';

const categoryIcons = {
  Frontend: Braces,
  Backend: Boxes,
  Database: Database,
  'DevOps & Tools': Wrench,
  Other: Sparkles,
};

function Skills() {
  const [skills, setSkills] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchSkills = async () => {
      try {
        const res = await portfolioService.getPublicSkills();
        if (isMounted && res?.data?.skills) {
          setSkills(res.data.skills);
        }
      } catch (err) {
        console.warn('Failed to fetch public skills:', err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };
    fetchSkills();
    return () => {
      isMounted = false;
    };
  }, []);

  // Group skills by category
  const groups = skills.reduce((acc, skill) => {
    const cat = skill.category || 'Other';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(skill);
    return acc;
  }, {});

  const groupKeys = Object.keys(groups);

  return (
    <section className={styles.section} id="skills">
      <SectionTitle
        eyebrow="Toolbox"
        title="Skills & technologies"
        description="A practical stack for building across the browser, server, and data layer."
      />

      {isLoading ? (
        <div className={styles.emptyNote}>
          <Sparkles size={18} />
          <span>Loading skills from database...</span>
        </div>
      ) : groupKeys.length ? (
        <div className={styles.skillGrid}>
          {groupKeys.map((catName) => {
            const Icon = categoryIcons[catName] || Sparkles;
            const items = groups[catName];

            return (
              <article className={styles.skillCard} key={catName}>
                <div className={styles.cardIcon}>
                  <Icon size={18} />
                </div>
                <h3>{catName}</h3>
                <div className={styles.tags}>
                  {items.map((skill) => (
                    <span
                      key={skill._id || skill.name}
                      title={skill.proficiency ? `Proficiency: ${skill.proficiency}` : undefined}
                      style={
                        skill.isFeatured
                          ? { borderColor: 'rgba(0, 242, 254, 0.4)', background: 'rgba(0, 242, 254, 0.08)' }
                          : {}
                      }
                    >
                      {skill.name}
                      {skill.isFeatured && (
                        <Star size={10} style={{ marginLeft: 4, color: '#00f2fe' }} />
                      )}
                    </span>
                  ))}
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <div className={styles.emptyNote}>
          <Sparkles size={18} />
          <span>No skills published yet.</span>
        </div>
      )}
    </section>
  );
}

export default Skills;
