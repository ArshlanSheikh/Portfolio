import { useState, useEffect } from 'react';
import { Boxes, Braces, Database, Workflow, Sparkles, Check, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import SectionTitle from '../../components/SectionTitle/SectionTitle.jsx';
import portfolioService from '../../services/portfolioService.js';
import styles from '../Sections.module.css';

const icons = [Workflow, Braces, Boxes, Database];

function Services() {
  const [services, setServices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchServices = async () => {
      try {
        const res = await portfolioService.getPublicServices();
        if (isMounted && res?.data?.services) {
          setServices(res.data.services);
        }
      } catch (err) {
        console.warn('Failed to fetch public services:', err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };
    fetchServices();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section className={styles.section} id="services">
      <SectionTitle
        eyebrow="How I can help"
        title="Services & offerings"
        description="Focused engineering solutions for teams, agencies, and founders building modern web products."
      />

      {isLoading ? (
        <div className={styles.emptyNote}>
          <Sparkles size={18} />
          <span>Loading services from database...</span>
        </div>
      ) : services.length ? (
        <div className={styles.serviceGrid}>
          {services.map((service, index) => {
            const Icon = icons[index % icons.length] || Workflow;

            return (
              <article className={styles.serviceCard} key={service._id || service.title}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Icon size={22} className={styles.serviceIcon} />
                  {service.startingPrice && (
                    <span
                      style={{
                        fontFamily: 'var(--mono)',
                        fontSize: '12px',
                        color: '#00f2fe',
                        background: 'rgba(0, 242, 254, 0.08)',
                        padding: '3px 8px',
                        borderRadius: '4px',
                        border: '1px solid rgba(0, 242, 254, 0.2)',
                      }}
                    >
                      From {service.startingPrice}
                    </span>
                  )}
                </div>

                <h3>{service.title}</h3>
                <p>{service.description}</p>

                {service.deliverables?.length > 0 && (
                  <ul style={{ margin: '14px 0 18px', padding: 0, listStyle: 'none' }}>
                    {service.deliverables.map((deliv, i) => (
                      <li
                        key={i}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 8,
                          fontSize: '12px',
                          color: '#cbd5e1',
                          marginBottom: 6,
                        }}
                      >
                        <Check size={13} style={{ color: '#10b981', flexShrink: 0 }} />
                        <span>{deliv}</span>
                      </li>
                    ))}
                  </ul>
                )}

                <div style={{ marginTop: 'auto', paddingTop: 12 }}>
                  <Link
                    to={service.ctaDestination || '/contact'}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 6,
                      fontSize: '12px',
                      fontWeight: 600,
                      color: '#00f2fe',
                      textDecoration: 'none',
                    }}
                  >
                    <span>{service.ctaLabel || 'Discuss Project'}</span>
                    <ArrowRight size={13} />
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <div className={styles.emptyNote}>
          <Workflow size={17} />
          <span>No services listed yet.</span>
        </div>
      )}
    </section>
  );
}

export default Services;
