import mongoose from 'mongoose';

const inquirySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Sender name is required'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    email: {
      type: String,
      required: [true, 'Sender email is required'],
      trim: true,
      lowercase: true,
      maxlength: [150, 'Email cannot exceed 150 characters'],
    },
    company: {
      type: String,
      default: '',
      maxlength: [100, 'Company cannot exceed 100 characters'],
    },
    inquiryType: {
      type: String,
      enum: ['Project Consultation', 'Freelance Work', 'Full-time Opportunity', 'Mentorship', 'General Inquiry'],
      default: 'Project Consultation',
      index: true,
    },
    subject: {
      type: String,
      required: [true, 'Subject is required'],
      trim: true,
      maxlength: [200, 'Subject cannot exceed 200 characters'],
    },
    message: {
      type: String,
      required: [true, 'Message is required'],
      maxlength: [4000, 'Message cannot exceed 4000 characters'],
    },
    status: {
      type: String,
      enum: ['New', 'Reviewed', 'Contacted', 'Archived'],
      default: 'New',
      index: true,
    },
    isRead: {
      type: Boolean,
      default: false,
      index: true,
    },
    ipAddress: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

const Inquiry = mongoose.model('Inquiry', inquirySchema);

export default Inquiry;
