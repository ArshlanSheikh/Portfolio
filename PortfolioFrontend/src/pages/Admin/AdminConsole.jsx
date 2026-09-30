import { useState } from 'react'
import { ArrowUpRight, BriefcaseBusiness, Check, Clock3, FolderKanban, MessageSquareText, Pencil, Plus, Search, Trash2, UsersRound, X } from 'lucide-react'
import { projects as exampleProjects } from '../../data/projects.js'
import { skillGroups } from '../../data/skills.js'
import styles from './AdminConsole.module.css'

const sampleInquiries = [
  { id: 'sample-1', name: 'Sample inquiry', email: 'example@sample.test', subject: 'Website project', date: 'Sample record', status: 'New', message: 'Example inquiry preview. Replace with records from the connected API.' },
  { id: 'sample-2', name: 'Sample inquiry', email: 'hello@sample.test', subject: 'API integration', date: 'Sample record', status: 'Reviewed', message: 'Example inquiry preview. No real contact information is shown.' },
]

const pageMeta = {
  dashboard: ['Dashboard', 'A quick overview of your portfolio content.'],
  projects: ['Projects', 'Manage project entries shown on the public portfolio.'],
  experience: ['Experience', 'Add roles only when the details are ready to publish.'],
  skills: ['Skills', 'Review the technology groups used on the public site.'],
  education: ['Education', 'Manage public education details.'],
  certifications: ['Certifications', 'Manage verifiable credentials.'],
  achievements: ['Achievements', 'Keep this list for concrete milestones.'],
  inquiries: ['Inquiries', 'Review contact form submissions after API integration.'],
}

function AdminConsole({ view }) {
  const [projects, setProjects] = useState(exampleProjects)
  const [query, setQuery] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState(null)
  const [selectedInquiry, setSelectedInquiry] = useState(sampleInquiries[0])
  const [inquiryFilter, setInquiryFilter] = useState('All')
  const [notice, setNotice] = useState('')
  const [title, description] = pageMeta[view] ?? pageMeta.dashboard

  function saveProject(event) {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const project = {
      id: editing?.id ?? `local-${Date.now()}`,
      title: String(form.get('title')).trim(),
      description: String(form.get('description')).trim(),
      image: String(form.get('image')).trim(),
      technologies: String(form.get('technologies')).split(',').map((item) => item.trim()).filter(Boolean),
      githubUrl: String(form.get('githubUrl')).trim(),
      liveUrl: String(form.get('liveUrl')).trim(),
      featured: form.get('featured') === 'on',
      isExample: false,
    }
    setProjects((current) => editing ? current.map((item) => item.id === editing.id ? project : item) : [project, ...current])
    setShowForm(false)
    setEditing(null)
    setNotice('Saved in this browser session only. Connect the project service to persist changes.')
  }

  function removeProject(id) {
    setProjects((current) => current.filter((project) => project.id !== id))
    setNotice('Removed from this browser session only.')
  }

  const filteredProjects = projects.filter((project) => `${project.title} ${project.technologies.join(' ')}`.toLowerCase().includes(query.toLowerCase()))
  const filteredInquiries = sampleInquiries.filter((item) => (inquiryFilter === 'All' || item.status === inquiryFilter) && `${item.name} ${item.email} ${item.subject}`.toLowerCase().includes(query.toLowerCase()))

  return (
    <div className={styles.page}>
      <header className={styles.heading}><div><p className={styles.eyebrow}>PORTFOLIO / CMS</p><h1>{title}</h1><p>{description}</p></div>{view === 'projects' && <button className={styles.actionButton} type="button" onClick={() => { setEditing(null); setShowForm(true) }}><Plus size={16} />Add project</button>}</header>
      {(notice || view === 'projects') && <p className={styles.localNotice} role="status">{notice || 'Project edits are temporary and stay in this browser session.'}</p>}
      {view === 'dashboard' && <Dashboard projects={projects} />}
      {view === 'projects' && <ProjectManager projects={filteredProjects} query={query} setQuery={setQuery} onEdit={(project) => { setEditing(project); setShowForm(true) }} onDelete={removeProject} />}
      {view === 'inquiries' && <InquiryManager inquiries={filteredInquiries} query={query} setQuery={setQuery} filter={inquiryFilter} setFilter={setInquiryFilter} selected={selectedInquiry} setSelected={setSelectedInquiry} />}
      {view === 'skills' && <SkillsManager />}
      {!['dashboard', 'projects', 'inquiries', 'skills'].includes(view) && <EmptyManager title={title} />}
      {showForm && <ProjectForm project={editing} onCancel={() => { setShowForm(false); setEditing(null) }} onSubmit={saveProject} />}
    </div>
  )
}

function Dashboard({ projects }) {
  const metrics = [
    { label: 'Total projects', value: projects.length, note: 'Includes concept examples', icon: FolderKanban },
    { label: 'Total skills', value: skillGroups.reduce((total, group) => total + group.items.length, 0), note: 'Across 4 categories', icon: SparkIcon },
    { label: 'Experience entries', value: 0, note: 'Add verified role details', icon: BriefcaseBusiness },
    { label: 'Real inquiries', value: 0, note: 'API connection required', icon: MessageSquareText },
  ]
  return <>
    <div className={styles.metricGrid}>{metrics.map(({ label, value, note, icon: Icon }) => <article className={styles.metric} key={label}><span className={styles.metricIcon}><Icon size={17} /></span><p>{label}</p><strong>{value}</strong><small>{note}</small></article>)}</div>
    <section className={styles.panel}><div className={styles.panelTitle}><div><h2>Recent inquiries</h2><p>Static sample rows · not real submissions</p></div><a href="/admin/inquiries">View inbox <ArrowUpRight size={14} /></a></div><div className={styles.sampleRows}>{sampleInquiries.map((item) => <div key={item.id}><span className={styles.initials}>S</span><span><strong>{item.subject}</strong><small>{item.name} · {item.date}</small></span><span className={styles.sampleBadge}>SAMPLE</span></div>)}</div></section>
    <section className={styles.panel}><div className={styles.panelTitle}><div><h2>Project content</h2><p>Example concept records, editable in this session</p></div><a href="/admin/projects">Manage projects <ArrowUpRight size={14} /></a></div><div className={styles.sampleRows}>{projects.slice(0, 3).map((project) => <div key={project.id}><span className={styles.initials}><FolderKanban size={15} /></span><span><strong>{project.title}</strong><small>{project.technologies.join(' · ')}</small></span><span className={styles.status}>{project.isExample ? 'Concept' : 'Local edit'}</span></div>)}</div></section>
  </>
}

function SparkIcon() { return <UsersRound size={17} /> }

function ProjectManager({ projects, query, setQuery, onEdit, onDelete }) {
  return <section className={styles.panel}><div className={styles.toolbar}><label className={styles.search}><Search size={16} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search projects" aria-label="Search projects" /></label><span>{projects.length} projects</span></div><div className={styles.tableWrap}><table><thead><tr><th>Project</th><th>Technologies</th><th>Status</th><th>Links</th><th>Actions</th></tr></thead><tbody>{projects.map((project) => <tr key={project.id}><td><strong>{project.title}</strong><small>{project.description}</small></td><td>{project.technologies.join(', ')}</td><td><span className={styles.status}>{project.isExample ? 'Concept' : 'Local'}</span></td><td>{project.githubUrl || project.liveUrl ? 'Configured' : 'Pending'}</td><td><div className={styles.rowActions}><button type="button" aria-label={`Edit ${project.title}`} onClick={() => onEdit(project)}><Pencil size={15} /></button><button type="button" aria-label={`Delete ${project.title}`} onClick={() => onDelete(project.id)}><Trash2 size={15} /></button></div></td></tr>)}</tbody></table>{!projects.length && <p className={styles.empty}>No matching projects.</p>}</div></section>
}

function ProjectForm({ project, onCancel, onSubmit }) {
  return <div className={styles.modalBackdrop} role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onCancel()}><section className={styles.modal} role="dialog" aria-modal="true" aria-labelledby="project-form-title"><header><div><p className={styles.eyebrow}>LOCAL DRAFT</p><h2 id="project-form-title">{project ? 'Edit project' : 'Add project'}</h2></div><button type="button" aria-label="Close form" onClick={onCancel}><X size={18} /></button></header><form onSubmit={onSubmit}><AdminField label="Title" name="title" defaultValue={project?.title} required /><AdminField label="Description" name="description" defaultValue={project?.description} multiline required /><AdminField label="Image URL" name="image" defaultValue={project?.image} /><AdminField label="Technologies (comma separated)" name="technologies" defaultValue={project?.technologies.join(', ')} /><AdminField label="GitHub URL" name="githubUrl" defaultValue={project?.githubUrl} type="url" /><AdminField label="Live URL" name="liveUrl" defaultValue={project?.liveUrl} type="url" /><label className={styles.checkbox}><input type="checkbox" name="featured" defaultChecked={project?.featured} /> Featured project</label><footer><button className={styles.cancelButton} type="button" onClick={onCancel}>Cancel</button><button className={styles.actionButton} type="submit"><Check size={15} />Save local draft</button></footer></form></section></div>
}

function AdminField({ label, name, defaultValue = '', type = 'text', required = false, multiline = false }) {
  const id = `project-${name}`
  return <label className={styles.formField} htmlFor={id}>{label}{multiline ? <textarea id={id} name={name} defaultValue={defaultValue} required={required} rows="3" /> : <input id={id} name={name} type={type} defaultValue={defaultValue} required={required} />}</label>
}

function InquiryManager({ inquiries, query, setQuery, filter, setFilter, selected, setSelected }) {
  return <div className={styles.inquiryLayout}><section className={styles.panel}><div className={styles.toolbar}><label className={styles.search}><Search size={16} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search inquiries" aria-label="Search inquiries" /></label><select value={filter} onChange={(event) => setFilter(event.target.value)} aria-label="Filter inquiries"><option>All</option><option>New</option><option>Reviewed</option></select></div><div className={styles.inquiryList}>{inquiries.map((item) => <button type="button" key={item.id} className={`${styles.inquiryRow} ${selected?.id === item.id ? styles.selected : ''}`} onClick={() => setSelected(item)}><span><strong>{item.subject}</strong><small>{item.name} · {item.date}</small></span><span className={styles.status}>{item.status}</span></button>)}{!inquiries.length && <p className={styles.empty}>No matching sample inquiries.</p>}</div></section><aside className={styles.panel + ' ' + styles.detail}><p className={styles.eyebrow}>SAMPLE DETAILS</p>{selected ? <><h2>{selected.subject}</h2><p>{selected.name} · {selected.email}</p><span className={styles.status}>{selected.status}</span><p className={styles.detailMessage}>{selected.message}</p><button className={styles.cancelButton} type="button" disabled title="Inquiry API is not connected"><Trash2 size={14} />Delete</button></> : <p>Select an inquiry to review details.</p>}</aside></div>
}

function SkillsManager() {
  return <section className={styles.panel}><p className={styles.localNotice}>These entries come from src/data/skills.js. Backend editing is not connected.</p>{skillGroups.map((group) => <div className={styles.skillRow} key={group.name}><strong>{group.name}</strong><span>{group.items.join(' · ')}</span></div>)}</section>
}

function EmptyManager({ title }) {
  return <section className={styles.emptyPanel}><Clock3 size={22} /><h2>{title} data is not connected</h2><p>There are no verified records to show. Add real information to the matching data file, or connect the backend service when it is ready.</p><span>NO RECORDS</span></section>
}

export default AdminConsole