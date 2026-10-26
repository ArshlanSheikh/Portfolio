import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Project title is required'],
      trim: true,
    },
    slug: {
      type: String,
      required: [true, 'Project slug is required'],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    summary: {
      type: String,
      required: [true, 'Short summary is required'],
    },
    description: {
      type: String,
      required: [true, 'Full description is required'],
    },
    problemStatement: {
      type: String,
      default: '',
    },
    solution: {
      type: String,
      default: '',
    },
    features: [
      {
        type: String,
      },
    ],
    technologies: [
      {
        type: String,
        required: true,
      },
    ],
    architectureNotes: {
      type: String,
      default: '',
    },
    challengesAndSolutions: [
      {
        challenge: { type: String, default: '' },
        solution: { type: String, default: '' },
      },
    ],
    resultsAndImpact: {
      type: String,
      default: '',
    },
    thumbnail: {
      type: String,
      default: '',
    },
    screenshots: [
      {
        type: String,
      },
    ],
    liveDemoUrl: {
      type: String,
      default: '',
    },
    repoUrl: {
      type: String,
      default: '',
    },
    category: {
      type: String,
      default: 'Full Stack',
      index: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
      index: true,
    },
    order: {
      type: Number,
      default: 0,
    },
    isPublished: {
      type: Boolean,
      default: true,
      index: true,
    },
    seoTitle: {
      type: String,
      default: '',
    },
    seoDescription: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

const Project = mongoose.model('Project', projectSchema);

export default Project;
