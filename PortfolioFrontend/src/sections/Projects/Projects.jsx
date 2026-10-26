import { useState, useEffect } from 'react';
import { ArrowUpRight, GitBranch, Layers3, X, ExternalLink, Sparkles } from 'lucide-react';
import SectionTitle from '../../components/SectionTitle/SectionTitle.jsx';
import portfolioService from '../../services/portfolioService.js';
import styles from './Projects.module.css';

export function ProjectCard({ project, onOpenDetails }) {
  const thumbnail = project.thumbnail || project.image;

  return (
    <article className={styles.card}>
      <div className={styles.preview} onClick={() => onOpenDetails(project)} style={{ cursor: 'pointer' }}>
        {thumbnail ? (
          <img src={thumbnail} alt={`${project.title} preview`} loading="lazy" />
        ) : (
          <div className={styles.previewArt}>
            <span className={styles.previewTop}><i /><i /><i /></span>
            <span className={styles.previewPanel}><b /><b /><b /></span>
            <span className={styles.previewChart} />
          </div>
        )}
        {project.isFeatured && <span className={styles.example}>Featured</span>}
      </div>

      <div className={styles.cardBody}>
        <div
          className={styles.cardHeading}
          onClick={() => onOpenDetails(project)}
          style={{ cursor: 'pointer' }}
        >
          <h3>{project.title}</h3>
          <Layers3 size={17} />
        </div>

        <p>{project.summary || project.description}</p>

        <div className={styles.tags}>
          {(project.technologies || []).map((technology) => (
            <span key={technology}>{technology}</span>
          ))}
        </div>

        <div className={styles.cardLinks}>
          {project.repoUrl || project.githubUrl ? (
            <a
              href={project.repoUrl || project.githubUrl}
              target="_blank"
              rel="noreferrer"
            >
              <GitBranch size={15} /> Source
            </a>
          ) : (
            <span style={{ color: 'var(--muted)', fontSize: '12px' }}>
              <GitBranch size={15} /> Private
            </span>
          )}

          {project.liveDemoUrl || project.liveUrl ? (
            <a
              href={project.liveDemoUrl || project.liveUrl}
              target="_blank"
              rel="noreferrer"
            >
              Live Demo <ArrowUpRight size={15} />
            </a>
          ) : (
            <button
              type="button"
              onClick={() => onOpenDetails(project)}
              style={{
                background: 'none',
                border: 'none',
                color: '#00f2fe',
                fontSize: '12px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                padding: 0,
              }}
            >
              Details <ArrowUpRight size={13} />
            </button>
          )}
        </div>
      </div>
    </article>
  );
}

function ProjectDetailsModal({ project, onClose }) {
  if (!project) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        backdropFilter: 'blur(6px)',
        zIndex: 999,
        display: 'grid',
        placeItems: 'center',
        padding: '20px',
      }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        style={{
          width: 'min(720px, 100%)',
          maxHeight: '90vh',
          overflowY: 'auto',
          backgroundColor: '#0f141f',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '16px',
          padding: '28px',
          boxShadow: '0 24px 48px rgba(0, 0, 0, 0.6)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
          <div>
            <span style={{ fontFamily: 'var(--mono)', fontSize: '11px', color: '#00f2fe', letterSpacing: '0.1em' }}>
              {project.category || 'PROJECT CASE STUDY'}
            </span>
            <h2 style={{ margin: '4px 0 0', fontSize: '24px', color: '#fff' }}>{project.title}</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: '#94a3b8',
              cursor: 'pointer',
              padding: 4,
            }}
          >
            <X size={20} />
          </button>
        </div>

        {project.thumbnail && (
          <img
            src={project.thumbnail}
            alt={project.title}
            style={{ width: '100%', height: '240px', objectFit: 'cover', borderRadius: '10px', marginBottom: 20 }}
          />
        )}

        <p style={{ color: '#cbd5e1', fontSize: '14px', lineHeight: 1.7, marginBottom: 20 }}>
          {project.description}
        </p>

        {project.problemStatement && (
          <div style={{ marginBottom: 16 }}>
            <strong style={{ display: 'block', color: '#f8fafc', fontSize: '13px', marginBottom: 4 }}>
              The Problem
            </strong>
            <p style={{ margin: 0, color: '#94a3b8', fontSize: '13px', lineHeight: 1.6 }}>
              {project.problemStatement}
            </p>
          </div>
        )}

        {project.solution && (
          <div style={{ marginBottom: 16 }}>
            <strong style={{ display: 'block', color: '#f8fafc', fontSize: '13px', marginBottom: 4 }}>
              The Solution & Architecture
            </strong>
            <p style={{ margin: 0, color: '#94a3b8', fontSize: '13px', lineHeight: 1.6 }}>
              {project.solution}
            </p>
          </div>
        )}

        {project.features?.length > 0 && (
          <div style={{ marginBottom: 20 }}>
            <strong style={{ display: 'block', color: '#f8fafc', fontSize: '13px', marginBottom: 8 }}>
              Key Features
            </strong>
            <ul style={{ margin: 0, paddingLeft: 18, color: '#94a3b8', fontSize: '13px', lineHeight: 1.7 }}>
              {project.features.map((feat, i) => (
                <li key={i}>{feat}</li>
              ))}
            </ul>
          </div>
        )}

        <div style={{ marginBottom: 24 }}>
          <strong style={{ display: 'block', color: '#f8fafc', fontSize: '13px', marginBottom: 8 }}>
            Technologies
          </strong>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {(project.technologies || []).map((t) => (
              <span
                key={t}
                style={{
                  padding: '4px 10px',
                  borderRadius: '6px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  fontSize: '12px',
                  color: '#e2e8f0',
                }}
              >
                {t}
              </span>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', gap: 12 }}>
          {(project.liveDemoUrl || project.liveUrl) && (
            <a
              href={project.liveDemoUrl || project.liveUrl}
              target="_blank"
              rel="noreferrer"
              className="button buttonPrimary"
            >
              Open Live Demo <ExternalLink size={14} />
            </a>
          )}
          {(project.repoUrl || project.githubUrl) && (
            <a
              href={project.repoUrl || project.githubUrl}
              target="_blank"
              rel="noreferrer"
              className="button buttonQuiet"
            >
              GitHub Repository <GitBranch size={14} />
            </a>
          )}
          <button
            type="button"
            className="button buttonQuiet"
            onClick={onClose}
            style={{ marginLeft: 'auto' }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

function Projects() {
  const [projects, setProjects] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedProject, setSelectedProject] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchProjects = async () => {
      try {
        const res = await portfolioService.getPublicProjects();
        if (isMounted && res?.data?.projects) {
          setProjects(res.data.projects);
        }
      } catch (err) {
        console.warn('Failed to fetch public projects:', err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };
    fetchProjects();
    return () => {
      isMounted = false;
    };
  }, []);

  const categories = ['All', ...new Set(projects.map((p) => p.category).filter(Boolean))];
  const filteredProjects =
    activeCategory === 'All'
      ? projects
      : projects.filter((p) => p.category === activeCategory);

  return (
    <section className={styles.section} id="projects">
      <SectionTitle
        eyebrow="Selected work"
        title="Projects & applications"
        description="Production web applications engineered with modern frontend interfaces and scalable backend systems."
      />

      {categories.length > 1 && (
        <div style={{ display: 'flex', gap: 8, marginBottom: 28, flexWrap: 'wrap' }}>
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              style={{
                padding: '6px 14px',
                borderRadius: '8px',
                border: activeCategory === cat ? '1px solid #00f2fe' : '1px solid rgba(255, 255, 255, 0.08)',
                background: activeCategory === cat ? 'rgba(0, 242, 254, 0.12)' : 'rgba(255, 255, 255, 0.03)',
                color: activeCategory === cat ? '#00f2fe' : '#94a3b8',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {isLoading ? (
        <div style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>
          <Sparkles size={18} style={{ marginBottom: 8 }} />
          <p>Loading projects from database...</p>
        </div>
      ) : filteredProjects.length ? (
        <div className={styles.grid}>
          {filteredProjects.map((project) => (
            <ProjectCard
              key={project._id || project.slug}
              project={project}
              onOpenDetails={(p) => setSelectedProject(p)}
            />
          ))}
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>
          No published projects found in this category.
        </div>
      )}

      {selectedProject && (
        <ProjectDetailsModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      )}
    </section>
  );
}

export default Projects;
