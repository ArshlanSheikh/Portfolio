import mongoose from 'mongoose';

const profileSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
    },
    title: {
      type: String,
      required: [true, 'Professional title is required'],
      trim: true,
    },
    bio: {
      type: String,
      required: [true, 'Bio is required'],
    },
    shortBio: {
      type: String,
      default: '',
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
    },
    phone: {
      type: String,
      default: '',
    },
    location: {
      type: String,
      default: '',
    },
    avatar: {
      type: String,
      default: '',
    },
    resumeUrl: {
      type: String,
      default: '',
    },
    availabilityStatus: {
      type: String,
      enum: ['Available', 'Open to opportunities', 'Busy', 'Unavailable'],
      default: 'Available',
    },
    availabilityNote: {
      type: String,
      default: 'Available for freelance & full-time roles',
    },
    socialLinks: [
      {
        platform: { type: String, required: true },
        url: { type: String, required: true },
        icon: { type: String, default: '' },
      },
    ],
    stats: [
      {
        label: { type: String, required: true },
        value: { type: String, required: true },
        description: { type: String, default: '' },
      },
    ],
  },
  { timestamps: true }
);

const Profile = mongoose.model('Profile', profileSchema);

export default Profile;
