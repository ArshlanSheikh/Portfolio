import mongoose from 'mongoose';

const settingsSchema = new mongoose.Schema(
  {
    siteTitle: {
      type: String,
      default: 'Arshlan Sheikh | Full Stack Web Developer',
      trim: true,
    },
    siteDescription: {
      type: String,
      default: 'Experienced Full Stack MERN Developer crafting high-performance React web applications, robust Node.js APIs, and scalable MongoDB databases.',
    },
    siteUrl: {
      type: String,
      default: 'http://localhost:5173',
    },
    ogImage: {
      type: String,
      default: '',
    },
    favicon: {
      type: String,
      default: '',
    },
    theme: {
      mode: { type: String, enum: ['dark', 'light'], default: 'dark' },
      accentColor: { type: String, default: '#00f2fe' },
      heroVariant: { type: String, enum: ['standard', 'minimal', 'split'], default: 'standard' },
    },
    sectionVisibility: {
      about: { type: Boolean, default: true },
      skills: { type: Boolean, default: true },
      experience: { type: Boolean, default: true },
      projects: { type: Boolean, default: true },
      services: { type: Boolean, default: true },
      education: { type: Boolean, default: true },
      certifications: { type: Boolean, default: true },
      achievements: { type: Boolean, default: true },
      testimonials: { type: Boolean, default: true },
      blog: { type: Boolean, default: true },
      contact: { type: Boolean, default: true },
    },
    resumeEnabled: {
      type: Boolean,
      default: true,
    },
    resumeUrl: {
      type: String,
      default: '',
    },
    contactEmail: {
      type: String,
      default: 'arshlans29@gmail.com',
    },
    contactPhone: {
      type: String,
      default: '',
    },
    contactAddress: {
      type: String,
      default: '',
    },
    githubUrl: {
      type: String,
      default: 'https://github.com/ArshlanSheikh',
    },
    linkedinUrl: {
      type: String,
      default: 'https://www.linkedin.com/in/arshlan-sheikh-b27114236',
    },
    twitterUrl: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

const Settings = mongoose.model('Settings', settingsSchema);

export default Settings;
