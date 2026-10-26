import mongoose from 'mongoose';

const skillSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Skill name is required'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Skill category is required'],
      enum: ['Frontend', 'Backend', 'Database', 'DevOps & Tools', 'Other'],
      default: 'Frontend',
      index: true,
    },
    icon: {
      type: String,
      default: '',
    },
    proficiency: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert', ''],
      default: 'Advanced',
    },
    description: {
      type: String,
      default: '',
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
  },
  { timestamps: true }
);

const Skill = mongoose.model('Skill', skillSchema);

export default Skill;
