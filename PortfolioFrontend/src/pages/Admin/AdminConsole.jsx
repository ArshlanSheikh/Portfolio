import { useState, useEffect } from 'react';
import {
  BriefcaseBusiness,
  CheckCircle2,
  Clock3,
  FolderKanban,
  GraduationCap,
  Layers,
  MessageSquareText,
  Pencil,
  Plus,
  Search,
  Sparkles,
  Trash2,
  X,
  BookOpen,
  Mail,
  Star,
  Eye,
  EyeOff,
  ArrowUpRight,
  Check,
} from 'lucide-react';
import portfolioService from '../../services/portfolioService.js';
import styles from './AdminConsole.module.css';

const pageMeta = {
  dashboard: ['Dashboard', 'A live overview of your database metrics and content.'],
  profile: ['Profile & Bio', 'Manage your developer details, headline, and availability.'],
  projects: ['Projects', 'Manage, publish, and edit portfolio projects.'],
  skills: ['Skills', 'Manage your technical skillset grouped by category.'],
  experience: ['Experience', 'Manage chronological employment roles and responsibilities.'],
  services: ['Services', 'Manage client offerings, deliverables, and starting prices.'],
  education: ['Education', 'Manage formal degrees and academic background.'],
  certifications: ['Certifications', 'Manage verified credentials and certificates.'],
  achievements: ['Achievements', 'Track awards, milestones, and hackathon wins.'],
  testimonials: ['Testimonials', 'Review and approve client and team endorsements.'],
  blog: ['Blog Articles', 'Publish technical articles and architectural notes.'],
  inquiries: ['Inquiries', 'Review incoming public contact form submissions.'],
  media: ['Media Library', 'Upload and manage images and resume assets.'],
  settings: ['Settings', 'Customize theme accent, SEO tags, and site metadata.'],
};

function AdminConsole({ view = 'dashboard' }) {
  const [toast, setToast] = useState('');
  const [title, description] = pageMeta[view] ?? pageMeta.dashboard;

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(''), 4000);
  };

  return (
    <div className={styles.page}>
      <header className={styles.heading}>
        <div>
          <p className={styles.eyebrow}>CMS / {view.toUpperCase()}</p>
          <h1>{title}</h1>
          <p>{description}</p>
        </div>
      </header>

      {toast && (
        <div className={styles.toastSuccess} role="status">
          <CheckCircle2 size={16} />
          <span>{toast}</span>
        </div>
      )}

      {view === 'dashboard' && <DashboardView />}
      {view === 'profile' && <ProfileManager showToast={showToast} />}
      {view === 'projects' && <ProjectManager showToast={showToast} />}
      {view === 'skills' && <SkillsManager showToast={showToast} />}
      {view === 'experience' && <ExperienceManager showToast={showToast} />}
      {view === 'services' && <ServicesManager showToast={showToast} />}
      {view === 'education' && <EducationManager showToast={showToast} />}
      {!['dashboard', 'profile', 'projects', 'skills', 'experience', 'services', 'education'].includes(view) && (
        <ComingSoonManager title={title} />
      )}
    </div>
  );
}

// ------------------------------------------------------------------
// 1. DASHBOARD VIEW
// ------------------------------------------------------------------
function DashboardView() {
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchStats = async () => {
      try {
        const res = await portfolioService.getDashboardStats();
        if (isMounted && res?.data) {
          setStats(res.data);
        }
      } catch (err) {
        console.error('Failed to load dashboard metrics:', err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };
    fetchStats();
    return () => {
      isMounted = false;
    };
  }, []);

  const metrics = [
    { label: 'Total Projects', value: stats?.metrics?.totalProjects ?? 0, note: `${stats?.metrics?.publishedProjects ?? 0} published`, icon: FolderKanban },
    { label: 'Technical Skills', value: stats?.metrics?.totalSkills ?? 0, note: 'Across 4 categories', icon: Sparkles },
    { label: 'Experience Roles', value: stats?.metrics?.totalExperience ?? 0, note: 'Chronological timeline', icon: BriefcaseBusiness },
    { label: 'Offered Services', value: stats?.metrics?.totalServices ?? 0, note: 'Active client solutions', icon: Layers },
    { label: 'Education Records', value: stats?.metrics?.totalEducation ?? 0, note: 'Degrees & institutions', icon: GraduationCap },
    { label: 'Blog Posts', value: stats?.metrics?.totalPosts ?? 0, note: 'Published engineering posts', icon: BookOpen },
    { label: 'Total Inquiries', value: stats?.metrics?.totalInquiries ?? 0, note: `${stats?.metrics?.unreadInquiries ?? 0} unread`, icon: MessageSquareText },
  ];

  return (
    <>
      <div className={styles.metricGrid}>
        {metrics.map(({ label, value, note, icon: Icon }) => (
          <article className={styles.metric} key={label}>
            <span className={styles.metricIcon}>
              <Icon size={18} />
            </span>
            <p>{label}</p>
            <strong>{isLoading ? '...' : value}</strong>
            <small>{note}</small>
          </article>
        ))}
      </div>

      <section className={styles.panel}>
        <div className={styles.panelTitle}>
          <div>
            <h2>Recent Projects in Database</h2>
            <p>Latest entries available on your portfolio</p>
          </div>
          <a href="/admin/projects">
            Manage projects <ArrowUpRight size={14} />
          </a>
        </div>
        <div className={styles.sampleRows}>
          {stats?.recentProjects?.length ? (
            stats.recentProjects.map((p) => (
              <div key={p._id}>
                <span className={styles.initials}>
                  <FolderKanban size={15} />
                </span>
                <span>
                  <strong>{p.title}</strong>
                  <small>{(p.technologies || []).join(' · ')}</small>
                </span>
                <span
                  className={`${styles.status} ${
                    p.isPublished ? styles.statusPublished : styles.statusDraft
                  }`}
                >
                  {p.isPublished ? 'Published' : 'Draft'}
                </span>
              </div>
            ))
          ) : (
            <p className={styles.empty}>No projects recorded yet.</p>
          )}
        </div>
      </section>

      <section className={styles.panel}>
        <div className={styles.panelTitle}>
          <div>
            <h2>Recent Inquiries</h2>
            <p>Form submissions from visitors</p>
          </div>
          <a href="/admin/inquiries">
            View all inquiries <ArrowUpRight size={14} />
          </a>
        </div>
        <div className={styles.sampleRows}>
          {stats?.recentInquiries?.length ? (
            stats.recentInquiries.map((inq) => (
              <div key={inq._id}>
                <span className={styles.initials}>
                  <Mail size={15} />
                </span>
                <span>
                  <strong>{inq.subject}</strong>
                  <small>
                    {inq.name} ({inq.email})
                  </small>
                </span>
                <span className={styles.status}>{inq.status}</span>
              </div>
            ))
          ) : (
            <p className={styles.empty}>No incoming inquiries yet.</p>
          )}
        </div>
      </section>
    </>
  );
}

// ------------------------------------------------------------------
// 2. PROFILE & HERO MANAGER
// ------------------------------------------------------------------
function ProfileManager({ showToast }) {
  const [profile, setProfile] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchProfile = async () => {
      try {
        const res = await portfolioService.getAdminProfile();
        if (isMounted && res?.data?.profile) setProfile(res.data.profile);
      } catch (err) {
        console.error('Error fetching admin profile:', err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };
    fetchProfile();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    const fd = new FormData(e.currentTarget);
    const data = {
      fullName: fd.get('fullName'),
      title: fd.get('title'),
      shortBio: fd.get('shortBio'),
      bio: fd.get('bio'),
      email: fd.get('email'),
      phone: fd.get('phone'),
      location: fd.get('location'),
      avatar: fd.get('avatar'),
      resumeUrl: fd.get('resumeUrl'),
      availabilityStatus: fd.get('availabilityStatus'),
      availabilityNote: fd.get('availabilityNote'),
    };

    try {
      await portfolioService.updateProfile(data);
      showToast('Profile information saved successfully!');
    } catch (err) {
      alert(err.message || 'Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return <p className={styles.empty}>Loading profile from database...</p>;

  return (
    <div className={styles.profileCard}>
      <form onSubmit={handleSubmit}>
        <div className={styles.formGrid}>
          <div className={styles.formField}>
            <label>Full Name</label>
            <input name="fullName" defaultValue={profile?.fullName} required />
          </div>
          <div className={styles.formField}>
            <label>Professional Title</label>
            <input name="title" defaultValue={profile?.title} required />
          </div>
        </div>

        <div className={styles.formGrid}>
          <div className={styles.formField}>
            <label>Email Address</label>
            <input name="email" type="email" defaultValue={profile?.email} required />
          </div>
          <div className={styles.formField}>
            <label>Phone Number</label>
            <input name="phone" defaultValue={profile?.phone} />
          </div>
        </div>

        <div className={styles.formGrid}>
          <div className={styles.formField}>
            <label>Location</label>
            <input name="location" defaultValue={profile?.location} />
          </div>
          <div className={styles.formField}>
            <label>Avatar / Portrait URL</label>
            <input name="avatar" defaultValue={profile?.avatar} placeholder="https://..." />
          </div>
        </div>

        <div className={styles.formGrid}>
          <div className={styles.formField}>
            <label>Availability Status</label>
            <select name="availabilityStatus" defaultValue={profile?.availabilityStatus || 'Available'}>
              <option value="Available">Available</option>
              <option value="Open to opportunities">Open to opportunities</option>
              <option value="Busy">Busy</option>
              <option value="Unavailable">Unavailable</option>
            </select>
          </div>
          <div className={styles.formField}>
            <label>Availability Note</label>
            <input
              name="availabilityNote"
              defaultValue={profile?.availabilityNote || 'Available for freelance & full-time roles'}
            />
          </div>
        </div>

        <div className={styles.formField}>
          <label>Short Introduction (Hero)</label>
          <input name="shortBio" defaultValue={profile?.shortBio} />
        </div>

        <div className={styles.formField}>
          <label>Full Professional Biography</label>
          <textarea name="bio" rows="4" defaultValue={profile?.bio} required />
        </div>

        <div className={styles.formField}>
          <label>Resume PDF URL</label>
          <input name="resumeUrl" defaultValue={profile?.resumeUrl} placeholder="/resume or external URL" />
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 16 }}>
          <button className={styles.actionButton} type="submit" disabled={isSaving}>
            <Check size={16} />
            {isSaving ? 'Saving changes...' : 'Save Profile Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}

// ------------------------------------------------------------------
// 3. PROJECTS MANAGER
// ------------------------------------------------------------------
function ProjectManager({ showToast }) {
  const [projects, setProjects] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [showModal, setShowModal] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const reload = () => setRefreshTrigger((prev) => prev + 1);

  useEffect(() => {
    let isMounted = true;
    const fetchProjects = async () => {
      try {
        const res = await portfolioService.getAdminProjects({ search, category });
        if (isMounted && res?.data?.projects) {
          setProjects(res.data.projects);
        }
      } catch (err) {
        console.error('Error fetching admin projects:', err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };
    fetchProjects();
    return () => {
      isMounted = false;
    };
  }, [search, category, refreshTrigger]);

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete '${title}'? This action cannot be undone.`)) {
      return;
    }
    try {
      await portfolioService.deleteProject(id);
      showToast(`Project '${title}' deleted successfully.`);
      reload();
    } catch (err) {
      alert(err.message || 'Failed to delete project');
    }
  };

  const handleTogglePublish = async (project) => {
    try {
      await portfolioService.updateProject(project._id, { isPublished: !project.isPublished });
      showToast(`Project '${project.title}' is now ${!project.isPublished ? 'Published' : 'Draft'}.`);
      reload();
    } catch (err) {
      alert(err.message || 'Failed to toggle publication status');
    }
  };

  return (
    <>
      <section className={styles.panel}>
        <div className={styles.toolbar}>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <label className={styles.search}>
              <Search size={16} />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search projects or tech..."
              />
            </label>
            <select value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="All">All Categories</option>
              <option value="Full Stack">Full Stack</option>
              <option value="Frontend">Frontend</option>
              <option value="Backend">Backend</option>
            </select>
          </div>
          <button
            className={styles.actionButton}
            type="button"
            onClick={() => {
              setEditingProject(null);
              setShowModal(true);
            }}
          >
            <Plus size={16} /> Add Project
          </button>
        </div>

        <div className={styles.tableWrap}>
          <table>
            <thead>
              <tr>
                <th>Project</th>
                <th>Category</th>
                <th>Technologies</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan="5" className={styles.empty}>
                    Loading projects from database...
                  </td>
                </tr>
              ) : projects.length ? (
                projects.map((p) => (
                  <tr key={p._id}>
                    <td>
                      <strong>{p.title}</strong>
                      <small>{p.summary}</small>
                    </td>
                    <td>{p.category}</td>
                    <td>{(p.technologies || []).join(', ')}</td>
                    <td>
                      <span
                        className={`${styles.status} ${
                          p.isPublished ? styles.statusPublished : styles.statusDraft
                        }`}
                      >
                        {p.isPublished ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td>
                      <div className={styles.rowActions}>
                        <button
                          type="button"
                          title={p.isPublished ? 'Unpublish' : 'Publish'}
                          onClick={() => handleTogglePublish(p)}
                        >
                          {p.isPublished ? <EyeOff size={14} /> : <Eye size={14} />}
                        </button>
                        <button
                          type="button"
                          title="Edit project"
                          onClick={() => {
                            setEditingProject(p);
                            setShowModal(true);
                          }}
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          type="button"
                          className={styles.deleteBtn}
                          title="Delete project"
                          onClick={() => handleDelete(p._id, p.title)}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className={styles.empty}>
                    No projects found matching the criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {showModal && (
        <ProjectModal
          project={editingProject}
          onClose={() => setShowModal(false)}
          onSaved={() => {
            setShowModal(false);
            showToast('Project saved successfully!');
            reload();
          }}
        />
      )}
    </>
  );
}

function ProjectModal({ project, onClose, onSaved }) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const fd = new FormData(e.currentTarget);

    const payload = {
      title: fd.get('title'),
      slug: fd.get('slug'),
      category: fd.get('category'),
      summary: fd.get('summary'),
      description: fd.get('description'),
      problemStatement: fd.get('problemStatement'),
      solution: fd.get('solution'),
      technologies: fd.get('technologies'),
      thumbnail: fd.get('thumbnail'),
      liveDemoUrl: fd.get('liveDemoUrl'),
      repoUrl: fd.get('repoUrl'),
      isFeatured: fd.get('isFeatured') === 'on',
      isPublished: fd.get('isPublished') === 'on',
    };

    try {
      if (project?._id) {
        await portfolioService.updateProject(project._id, payload);
      } else {
        await portfolioService.createProject(payload);
      }
      onSaved();
    } catch (err) {
      alert(err.message || 'Failed to save project');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.modalBackdrop} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className={styles.modal}>
        <header>
          <div>
            <p className={styles.eyebrow}>{project ? 'EDIT PROJECT' : 'NEW PROJECT'}</p>
            <h2>{project ? project.title : 'Create New Project'}</h2>
          </div>
          <button type="button" onClick={onClose}>
            <X size={18} />
          </button>
        </header>

        <form onSubmit={handleSubmit}>
          <div className={styles.formGrid}>
            <div className={styles.formField}>
              <label>Project Title *</label>
              <input name="title" defaultValue={project?.title} required />
            </div>
            <div className={styles.formField}>
              <label>Slug (URL Identifier)</label>
              <input name="slug" defaultValue={project?.slug} placeholder="leave empty to auto-generate" />
            </div>
          </div>

          <div className={styles.formGrid}>
            <div className={styles.formField}>
              <label>Category</label>
              <select name="category" defaultValue={project?.category || 'Full Stack'}>
                <option value="Full Stack">Full Stack</option>
                <option value="Frontend">Frontend</option>
                <option value="Backend">Backend</option>
                <option value="Mobile">Mobile</option>
                <option value="Open Source">Open Source</option>
              </select>
            </div>
            <div className={styles.formField}>
              <label>Technologies (comma-separated) *</label>
              <input
                name="technologies"
                defaultValue={(project?.technologies || []).join(', ')}
                placeholder="React, Node.js, MongoDB"
                required
              />
            </div>
          </div>

          <div className={styles.formField}>
            <label>Short Summary *</label>
            <input name="summary" defaultValue={project?.summary} required />
          </div>

          <div className={styles.formField}>
            <label>Full Description *</label>
            <textarea name="description" rows="3" defaultValue={project?.description} required />
          </div>

          <div className={styles.formField}>
            <label>Problem Statement</label>
            <textarea name="problemStatement" rows="2" defaultValue={project?.problemStatement} />
          </div>

          <div className={styles.formField}>
            <label>Solution & Architecture</label>
            <textarea name="solution" rows="2" defaultValue={project?.solution} />
          </div>

          <div className={styles.formField}>
            <label>Thumbnail Image URL</label>
            <input name="thumbnail" defaultValue={project?.thumbnail} placeholder="https://..." />
          </div>

          <div className={styles.formGrid}>
            <div className={styles.formField}>
              <label>Live Demo URL</label>
              <input name="liveDemoUrl" type="url" defaultValue={project?.liveDemoUrl} placeholder="https://..." />
            </div>
            <div className={styles.formField}>
              <label>Repository URL</label>
              <input name="repoUrl" type="url" defaultValue={project?.repoUrl} placeholder="https://github.com/..." />
            </div>
          </div>

          <div style={{ display: 'flex', gap: 20, margin: '14px 0' }}>
            <label className={styles.checkbox}>
              <input type="checkbox" name="isFeatured" defaultChecked={project?.isFeatured} />
              <span>Feature on homepage</span>
            </label>
            <label className={styles.checkbox}>
              <input
                type="checkbox"
                name="isPublished"
                defaultChecked={project ? project.isPublished : true}
              />
              <span>Published (visible publicly)</span>
            </label>
          </div>

          <footer>
            <button type="button" className={styles.cancelButton} onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className={styles.actionButton} disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Save Project'}
            </button>
          </footer>
        </form>
      </div>
    </div>
  );
}

// ------------------------------------------------------------------
// 4. SKILLS MANAGER
// ------------------------------------------------------------------
function SkillsManager({ showToast }) {
  const [skills, setSkills] = useState([]);
  const [category, setCategory] = useState('All');
  const [showModal, setShowModal] = useState(false);
  const [editingSkill, setEditingSkill] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const reload = () => setRefreshTrigger((prev) => prev + 1);

  useEffect(() => {
    let isMounted = true;
    const fetchSkills = async () => {
      try {
        const res = await portfolioService.getAdminSkills({ category });
        if (isMounted && res?.data?.skills) setSkills(res.data.skills);
      } catch (err) {
        console.error('Error fetching admin skills:', err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };
    fetchSkills();
    return () => {
      isMounted = false;
    };
  }, [category, refreshTrigger]);

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete skill '${name}'?`)) return;
    try {
      await portfolioService.deleteSkill(id);
      showToast(`Skill '${name}' deleted.`);
      reload();
    } catch (err) {
      alert(err.message || 'Failed to delete skill');
    }
  };

  return (
    <>
      <section className={styles.panel}>
        <div className={styles.toolbar}>
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="All">All Categories</option>
            <option value="Frontend">Frontend</option>
            <option value="Backend">Backend</option>
            <option value="Database">Database</option>
            <option value="DevOps & Tools">DevOps & Tools</option>
          </select>
          <button
            className={styles.actionButton}
            type="button"
            onClick={() => {
              setEditingSkill(null);
              setShowModal(true);
            }}
          >
            <Plus size={16} /> Add Skill
          </button>
        </div>

        <div className={styles.tableWrap}>
          <table>
            <thead>
              <tr>
                <th>Skill Name</th>
                <th>Category</th>
                <th>Proficiency</th>
                <th>Featured</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan="6" className={styles.empty}>
                    Loading skills from database...
                  </td>
                </tr>
              ) : skills.length ? (
                skills.map((s) => (
                  <tr key={s._id}>
                    <td>
                      <strong>{s.name}</strong>
                    </td>
                    <td>{s.category}</td>
                    <td>{s.proficiency || 'Not specified'}</td>
                    <td>{s.isFeatured ? <Star size={14} style={{ color: '#00f2fe' }} /> : '—'}</td>
                    <td>
                      <span
                        className={`${styles.status} ${
                          s.isPublished ? styles.statusPublished : styles.statusDraft
                        }`}
                      >
                        {s.isPublished ? 'Published' : 'Hidden'}
                      </span>
                    </td>
                    <td>
                      <div className={styles.rowActions}>
                        <button
                          type="button"
                          onClick={() => {
                            setEditingSkill(s);
                            setShowModal(true);
                          }}
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          type="button"
                          className={styles.deleteBtn}
                          onClick={() => handleDelete(s._id, s.name)}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className={styles.empty}>
                    No skills found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {showModal && (
        <SkillModal
          skill={editingSkill}
          onClose={() => setShowModal(false)}
          onSaved={() => {
            setShowModal(false);
            showToast('Skill saved successfully!');
            reload();
          }}
        />
      )}
    </>
  );
}

function SkillModal({ skill, onClose, onSaved }) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const fd = new FormData(e.currentTarget);
    const payload = {
      name: fd.get('name'),
      category: fd.get('category'),
      proficiency: fd.get('proficiency'),
      description: fd.get('description'),
      isFeatured: fd.get('isFeatured') === 'on',
      isPublished: fd.get('isPublished') === 'on',
    };

    try {
      if (skill?._id) {
        await portfolioService.updateSkill(skill._id, payload);
      } else {
        await portfolioService.createSkill(payload);
      }
      onSaved();
    } catch (err) {
      alert(err.message || 'Failed to save skill');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.modalBackdrop} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className={styles.modal}>
        <header>
          <h2>{skill ? 'Edit Skill' : 'Add New Skill'}</h2>
          <button type="button" onClick={onClose}>
            <X size={18} />
          </button>
        </header>
        <form onSubmit={handleSubmit}>
          <div className={styles.formField}>
            <label>Skill Name *</label>
            <input name="name" defaultValue={skill?.name} required />
          </div>

          <div className={styles.formGrid}>
            <div className={styles.formField}>
              <label>Category *</label>
              <select name="category" defaultValue={skill?.category || 'Frontend'}>
                <option value="Frontend">Frontend</option>
                <option value="Backend">Backend</option>
                <option value="Database">Database</option>
                <option value="DevOps & Tools">DevOps & Tools</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className={styles.formField}>
              <label>Proficiency</label>
              <select name="proficiency" defaultValue={skill?.proficiency || 'Advanced'}>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
                <option value="Expert">Expert</option>
              </select>
            </div>
          </div>

          <div className={styles.formField}>
            <label>Notes / Context</label>
            <input name="description" defaultValue={skill?.description} placeholder="e.g. Hooks, Context, Next.js" />
          </div>

          <div style={{ display: 'flex', gap: 20, margin: '14px 0' }}>
            <label className={styles.checkbox}>
              <input type="checkbox" name="isFeatured" defaultChecked={skill?.isFeatured} />
              <span>Feature on homepage</span>
            </label>
            <label className={styles.checkbox}>
              <input
                type="checkbox"
                name="isPublished"
                defaultChecked={skill ? skill.isPublished : true}
              />
              <span>Published</span>
            </label>
          </div>

          <footer>
            <button type="button" className={styles.cancelButton} onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className={styles.actionButton} disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Save Skill'}
            </button>
          </footer>
        </form>
      </div>
    </div>
  );
}

// ------------------------------------------------------------------
// 5. EXPERIENCE MANAGER
// ------------------------------------------------------------------
function ExperienceManager({ showToast }) {
  const [experiences, setExperiences] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingExperience, setEditingExperience] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const reload = () => setRefreshTrigger((prev) => prev + 1);

  useEffect(() => {
    let isMounted = true;
    const fetchExp = async () => {
      try {
        const res = await portfolioService.getAdminExperience();
        if (isMounted && res?.data?.experiences) setExperiences(res.data.experiences);
      } catch (err) {
        console.error('Error fetching admin experience:', err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };
    fetchExp();
    return () => {
      isMounted = false;
    };
  }, [refreshTrigger]);

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Delete experience entry '${title}'?`)) return;
    try {
      await portfolioService.deleteExperience(id);
      showToast(`Experience entry deleted.`);
      reload();
    } catch (err) {
      alert(err.message || 'Failed to delete experience');
    }
  };

  return (
    <>
      <section className={styles.panel}>
        <div className={styles.toolbar}>
          <span>{experiences.length} experience entries recorded</span>
          <button
            className={styles.actionButton}
            type="button"
            onClick={() => {
              setEditingExperience(null);
              setShowModal(true);
            }}
          >
            <Plus size={16} /> Add Role
          </button>
        </div>

        <div className={styles.tableWrap}>
          <table>
            <thead>
              <tr>
                <th>Company</th>
                <th>Position</th>
                <th>Type</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan="5" className={styles.empty}>
                    Loading experience from database...
                  </td>
                </tr>
              ) : experiences.length ? (
                experiences.map((exp) => (
                  <tr key={exp._id}>
                    <td>
                      <strong>{exp.company}</strong>
                      <small>{exp.location || 'Remote'}</small>
                    </td>
                    <td>{exp.position}</td>
                    <td>{exp.employmentType}</td>
                    <td>
                      <span
                        className={`${styles.status} ${
                          exp.isCurrent ? styles.statusPublished : styles.statusDraft
                        }`}
                      >
                        {exp.isCurrent ? 'Current' : 'Past'}
                      </span>
                    </td>
                    <td>
                      <div className={styles.rowActions}>
                        <button
                          type="button"
                          onClick={() => {
                            setEditingExperience(exp);
                            setShowModal(true);
                          }}
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          type="button"
                          className={styles.deleteBtn}
                          onClick={() => handleDelete(exp._id, `${exp.position} at ${exp.company}`)}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className={styles.empty}>
                    No experience records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {showModal && (
        <ExperienceModal
          experience={editingExperience}
          onClose={() => setShowModal(false)}
          onSaved={() => {
            setShowModal(false);
            showToast('Experience record saved successfully!');
            reload();
          }}
        />
      )}
    </>
  );
}

function ExperienceModal({ experience, onClose, onSaved }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCurrent, setIsCurrent] = useState(experience?.isCurrent || false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const fd = new FormData(e.currentTarget);

    const responsibilities = String(fd.get('responsibilities'))
      .split('\n')
      .map((r) => r.trim())
      .filter(Boolean);

    const technologies = String(fd.get('technologies'))
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const payload = {
      company: fd.get('company'),
      position: fd.get('position'),
      employmentType: fd.get('employmentType'),
      location: fd.get('location'),
      companyUrl: fd.get('companyUrl'),
      startDate: fd.get('startDate'),
      endDate: isCurrent ? null : fd.get('endDate'),
      isCurrent,
      responsibilities,
      technologies,
      isPublished: fd.get('isPublished') === 'on',
    };

    try {
      if (experience?._id) {
        await portfolioService.updateExperience(experience._id, payload);
      } else {
        await portfolioService.createExperience(payload);
      }
      onSaved();
    } catch (err) {
      alert(err.message || 'Failed to save experience record');
    } finally {
      setIsSubmitting(false);
    }
  };

  const startVal = experience?.startDate ? new Date(experience.startDate).toISOString().slice(0, 10) : '';
  const endVal = experience?.endDate ? new Date(experience.endDate).toISOString().slice(0, 10) : '';

  return (
    <div className={styles.modalBackdrop} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className={styles.modal}>
        <header>
          <h2>{experience ? 'Edit Role' : 'Add Experience Role'}</h2>
          <button type="button" onClick={onClose}>
            <X size={18} />
          </button>
        </header>
        <form onSubmit={handleSubmit}>
          <div className={styles.formGrid}>
            <div className={styles.formField}>
              <label>Company Name *</label>
              <input name="company" defaultValue={experience?.company} required />
            </div>
            <div className={styles.formField}>
              <label>Job Position *</label>
              <input name="position" defaultValue={experience?.position} required />
            </div>
          </div>

          <div className={styles.formGrid}>
            <div className={styles.formField}>
              <label>Employment Type</label>
              <select name="employmentType" defaultValue={experience?.employmentType || 'Full-time'}>
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
                <option value="Freelance">Freelance</option>
                <option value="Internship">Internship</option>
              </select>
            </div>
            <div className={styles.formField}>
              <label>Location</label>
              <input name="location" defaultValue={experience?.location} placeholder="Remote / City" />
            </div>
          </div>

          <div className={styles.formGrid}>
            <div className={styles.formField}>
              <label>Start Date *</label>
              <input type="date" name="startDate" defaultValue={startVal} required />
            </div>
            <div className={styles.formField}>
              <label>End Date</label>
              <input type="date" name="endDate" defaultValue={endVal} disabled={isCurrent} />
            </div>
          </div>

          <div style={{ marginBottom: 14 }}>
            <label className={styles.checkbox}>
              <input
                type="checkbox"
                checked={isCurrent}
                onChange={(e) => setIsCurrent(e.target.checked)}
              />
              <span>I currently work here</span>
            </label>
          </div>

          <div className={styles.formField}>
            <label>Key Responsibilities (one per line)</label>
            <textarea
              name="responsibilities"
              rows="3"
              defaultValue={(experience?.responsibilities || []).join('\n')}
            />
          </div>

          <div className={styles.formField}>
            <label>Technologies Used (comma-separated)</label>
            <input
              name="technologies"
              defaultValue={(experience?.technologies || []).join(', ')}
              placeholder="React, Node.js, Express, MongoDB"
            />
          </div>

          <div className={styles.formField}>
            <label>Company Website URL</label>
            <input name="companyUrl" type="url" defaultValue={experience?.companyUrl} placeholder="https://..." />
          </div>

          <div style={{ margin: '14px 0' }}>
            <label className={styles.checkbox}>
              <input
                type="checkbox"
                name="isPublished"
                defaultChecked={experience ? experience.isPublished : true}
              />
              <span>Published (visible on portfolio)</span>
            </label>
          </div>

          <footer>
            <button type="button" className={styles.cancelButton} onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className={styles.actionButton} disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Save Experience'}
            </button>
          </footer>
        </form>
      </div>
    </div>
  );
}

// ------------------------------------------------------------------
// 6. SERVICES MANAGER
// ------------------------------------------------------------------
function ServicesManager({ showToast }) {
  const [services, setServices] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const reload = () => setRefreshTrigger((prev) => prev + 1);

  useEffect(() => {
    let isMounted = true;
    const fetchServ = async () => {
      try {
        const res = await portfolioService.getAdminServices();
        if (isMounted && res?.data?.services) setServices(res.data.services);
      } catch (err) {
        console.error('Error fetching admin services:', err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };
    fetchServ();
    return () => {
      isMounted = false;
    };
  }, [refreshTrigger]);

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Delete service '${title}'?`)) return;
    try {
      await portfolioService.deleteService(id);
      showToast(`Service '${title}' deleted.`);
      reload();
    } catch (err) {
      alert(err.message || 'Failed to delete service');
    }
  };

  return (
    <>
      <section className={styles.panel}>
        <div className={styles.toolbar}>
          <span>{services.length} services configured</span>
          <button
            className={styles.actionButton}
            type="button"
            onClick={() => {
              setEditingService(null);
              setShowModal(true);
            }}
          >
            <Plus size={16} /> Add Service
          </button>
        </div>

        <div className={styles.tableWrap}>
          <table>
            <thead>
              <tr>
                <th>Service Title</th>
                <th>Starting Price</th>
                <th>Deliverables</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan="5" className={styles.empty}>
                    Loading services from database...
                  </td>
                </tr>
              ) : services.length ? (
                services.map((s) => (
                  <tr key={s._id}>
                    <td>
                      <strong>{s.title}</strong>
                      <small>{s.description}</small>
                    </td>
                    <td>{s.startingPrice || 'Custom Quote'}</td>
                    <td>{(s.deliverables || []).join(', ')}</td>
                    <td>
                      <span
                        className={`${styles.status} ${
                          s.isPublished ? styles.statusPublished : styles.statusDraft
                        }`}
                      >
                        {s.isPublished ? 'Published' : 'Hidden'}
                      </span>
                    </td>
                    <td>
                      <div className={styles.rowActions}>
                        <button
                          type="button"
                          onClick={() => {
                            setEditingService(s);
                            setShowModal(true);
                          }}
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          type="button"
                          className={styles.deleteBtn}
                          onClick={() => handleDelete(s._id, s.title)}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className={styles.empty}>
                    No services found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {showModal && (
        <ServiceModal
          service={editingService}
          onClose={() => setShowModal(false)}
          onSaved={() => {
            setShowModal(false);
            showToast('Service saved successfully!');
            reload();
          }}
        />
      )}
    </>
  );
}

function ServiceModal({ service, onClose, onSaved }) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const fd = new FormData(e.currentTarget);
    const payload = {
      title: fd.get('title'),
      description: fd.get('description'),
      deliverables: fd.get('deliverables'),
      startingPrice: fd.get('startingPrice'),
      ctaLabel: fd.get('ctaLabel'),
      ctaDestination: fd.get('ctaDestination'),
      isPublished: fd.get('isPublished') === 'on',
    };

    try {
      if (service?._id) {
        await portfolioService.updateService(service._id, payload);
      } else {
        await portfolioService.createService(payload);
      }
      onSaved();
    } catch (err) {
      alert(err.message || 'Failed to save service');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.modalBackdrop} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className={styles.modal}>
        <header>
          <h2>{service ? 'Edit Service' : 'Add New Service'}</h2>
          <button type="button" onClick={onClose}>
            <X size={18} />
          </button>
        </header>
        <form onSubmit={handleSubmit}>
          <div className={styles.formField}>
            <label>Service Title *</label>
            <input name="title" defaultValue={service?.title} required />
          </div>

          <div className={styles.formField}>
            <label>Description *</label>
            <textarea name="description" rows="3" defaultValue={service?.description} required />
          </div>

          <div className={styles.formGrid}>
            <div className={styles.formField}>
              <label>Starting Price (e.g. $1,200)</label>
              <input name="startingPrice" defaultValue={service?.startingPrice} placeholder="$1,500" />
            </div>
            <div className={styles.formField}>
              <label>CTA Button Label</label>
              <input name="ctaLabel" defaultValue={service?.ctaLabel || 'Discuss Project'} />
            </div>
          </div>

          <div className={styles.formField}>
            <label>Deliverables (comma-separated)</label>
            <input
              name="deliverables"
              defaultValue={(service?.deliverables || []).join(', ')}
              placeholder="Custom UI, REST API, Database indexing"
            />
          </div>

          <div className={styles.formField}>
            <label>CTA Destination Link</label>
            <input name="ctaDestination" defaultValue={service?.ctaDestination || '/contact'} />
          </div>

          <div style={{ margin: '14px 0' }}>
            <label className={styles.checkbox}>
              <input
                type="checkbox"
                name="isPublished"
                defaultChecked={service ? service.isPublished : true}
              />
              <span>Published</span>
            </label>
          </div>

          <footer>
            <button type="button" className={styles.cancelButton} onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className={styles.actionButton} disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Save Service'}
            </button>
          </footer>
        </form>
      </div>
    </div>
  );
}

// ------------------------------------------------------------------
// 7. EDUCATION MANAGER
// ------------------------------------------------------------------
function EducationManager({ showToast }) {
  const [educations, setEducations] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingEducation, setEditingEducation] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const reload = () => setRefreshTrigger((prev) => prev + 1);

  useEffect(() => {
    let isMounted = true;
    const fetchEdu = async () => {
      try {
        const res = await portfolioService.getAdminEducation();
        if (isMounted && res?.data?.educations) setEducations(res.data.educations);
      } catch (err) {
        console.error('Error fetching admin education:', err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };
    fetchEdu();
    return () => {
      isMounted = false;
    };
  }, [refreshTrigger]);

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Delete education record '${title}'?`)) return;
    try {
      await portfolioService.deleteEducation(id);
      showToast(`Education record deleted.`);
      reload();
    } catch (err) {
      alert(err.message || 'Failed to delete education record');
    }
  };

  return (
    <>
      <section className={styles.panel}>
        <div className={styles.toolbar}>
          <span>{educations.length} academic degrees recorded</span>
          <button
            className={styles.actionButton}
            type="button"
            onClick={() => {
              setEditingEducation(null);
              setShowModal(true);
            }}
          >
            <Plus size={16} /> Add Degree
          </button>
        </div>

        <div className={styles.tableWrap}>
          <table>
            <thead>
              <tr>
                <th>Institution</th>
                <th>Degree & Major</th>
                <th>Grade</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan="5" className={styles.empty}>
                    Loading education from database...
                  </td>
                </tr>
              ) : educations.length ? (
                educations.map((edu) => (
                  <tr key={edu._id}>
                    <td>
                      <strong>{edu.institution}</strong>
                    </td>
                    <td>
                      {edu.degree} — {edu.fieldOfStudy}
                    </td>
                    <td>{edu.grade || '—'}</td>
                    <td>
                      <span
                        className={`${styles.status} ${
                          edu.isPublished ? styles.statusPublished : styles.statusDraft
                        }`}
                      >
                        {edu.isPublished ? 'Published' : 'Hidden'}
                      </span>
                    </td>
                    <td>
                      <div className={styles.rowActions}>
                        <button
                          type="button"
                          onClick={() => {
                            setEditingEducation(edu);
                            setShowModal(true);
                          }}
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          type="button"
                          className={styles.deleteBtn}
                          onClick={() => handleDelete(edu._id, `${edu.degree} at ${edu.institution}`)}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className={styles.empty}>
                    No education records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {showModal && (
        <EducationModal
          education={editingEducation}
          onClose={() => setShowModal(false)}
          onSaved={() => {
            setShowModal(false);
            showToast('Education record saved successfully!');
            reload();
          }}
        />
      )}
    </>
  );
}

function EducationModal({ education, onClose, onSaved }) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const fd = new FormData(e.currentTarget);
    const payload = {
      institution: fd.get('institution'),
      degree: fd.get('degree'),
      fieldOfStudy: fd.get('fieldOfStudy'),
      startDate: fd.get('startDate'),
      endDate: fd.get('endDate') || null,
      grade: fd.get('grade'),
      description: fd.get('description'),
      isPublished: fd.get('isPublished') === 'on',
    };

    try {
      if (education?._id) {
        await portfolioService.updateEducation(education._id, payload);
      } else {
        await portfolioService.createEducation(payload);
      }
      onSaved();
    } catch (err) {
      alert(err.message || 'Failed to save education record');
    } finally {
      setIsSubmitting(false);
    }
  };

  const startVal = education?.startDate ? new Date(education.startDate).toISOString().slice(0, 10) : '';
  const endVal = education?.endDate ? new Date(education.endDate).toISOString().slice(0, 10) : '';

  return (
    <div className={styles.modalBackdrop} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className={styles.modal}>
        <header>
          <h2>{education ? 'Edit Education' : 'Add Education Record'}</h2>
          <button type="button" onClick={onClose}>
            <X size={18} />
          </button>
        </header>
        <form onSubmit={handleSubmit}>
          <div className={styles.formField}>
            <label>Institution / University *</label>
            <input name="institution" defaultValue={education?.institution} required />
          </div>

          <div className={styles.formGrid}>
            <div className={styles.formField}>
              <label>Degree (e.g. Bachelor of Technology) *</label>
              <input name="degree" defaultValue={education?.degree} required />
            </div>
            <div className={styles.formField}>
              <label>Field of Study *</label>
              <input name="fieldOfStudy" defaultValue={education?.fieldOfStudy} required />
            </div>
          </div>

          <div className={styles.formGrid}>
            <div className={styles.formField}>
              <label>Start Date *</label>
              <input type="date" name="startDate" defaultValue={startVal} required />
            </div>
            <div className={styles.formField}>
              <label>End Date</label>
              <input type="date" name="endDate" defaultValue={endVal} />
            </div>
          </div>

          <div className={styles.formField}>
            <label>Grade / Honors (Optional)</label>
            <input name="grade" defaultValue={education?.grade} placeholder="First Class with Distinction" />
          </div>

          <div className={styles.formField}>
            <label>Description / Course Highlights</label>
            <textarea name="description" rows="3" defaultValue={education?.description} />
          </div>

          <div style={{ margin: '14px 0' }}>
            <label className={styles.checkbox}>
              <input
                type="checkbox"
                name="isPublished"
                defaultChecked={education ? education.isPublished : true}
              />
              <span>Published</span>
            </label>
          </div>

          <footer>
            <button type="button" className={styles.cancelButton} onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className={styles.actionButton} disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Save Education'}
            </button>
          </footer>
        </form>
      </div>
    </div>
  );
}

// Fallback for Phase 3 & 4 items in Phase 2
function ComingSoonManager({ title }) {
  return (
    <section className={styles.panel} style={{ textAlign: 'center', padding: '48px 24px' }}>
      <Clock3 size={24} style={{ color: '#00f2fe', marginBottom: 12 }} />
      <h2 style={{ color: '#fff', fontSize: '18px', margin: '0 0 8px' }}>{title} Management</h2>
      <p style={{ color: '#94a3b8', fontSize: '13px', maxWidth: '480px', margin: '0 auto' }}>
        This module is slated for implementation in Phase 3 & 4. All Core CMS sections (Projects, Skills, Experience, Services, Education, Profile, and Dashboard) are fully operational.
      </p>
    </section>
  );
}

export default AdminConsole;