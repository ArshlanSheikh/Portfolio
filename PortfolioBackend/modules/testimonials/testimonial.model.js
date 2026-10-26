import mongoose from 'mongoose';

const testimonialSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Person name is required'],
      trim: true,
    },
    role: {
      type: String,
      required: [true, 'Role or title is required'],
      trim: true,
    },
    organization: {
      type: String,
      required: [true, 'Company or organization is required'],
      trim: true,
    },
    avatar: {
      type: String,
      default: '',
    },
    content: {
      type: String,
      required: [true, 'Testimonial content is required'],
    },
    profileUrl: {
      type: String,
      default: '',
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      default: 5,
    },
    order: {
      type: Number,
      default: 0,
    },
    isApproved: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  { timestamps: true }
);

const Testimonial = mongoose.model('Testimonial', testimonialSchema);

export default Testimonial;
