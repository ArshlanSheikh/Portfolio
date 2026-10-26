import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Service title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Service description is required'],
    },
    icon: {
      type: String,
      default: '',
    },
    deliverables: [
      {
        type: String,
      },
    ],
    startingPrice: {
      type: String,
      default: '',
    },
    ctaLabel: {
      type: String,
      default: 'Discuss Project',
    },
    ctaDestination: {
      type: String,
      default: '/contact',
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

const Service = mongoose.model('Service', serviceSchema);

export default Service;
