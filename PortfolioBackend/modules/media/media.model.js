import mongoose from 'mongoose';

const mediaAssetSchema = new mongoose.Schema(
  {
    url: {
      type: String,
      required: [true, 'Asset URL is required'],
    },
    publicId: {
      type: String,
      default: '',
    },
    originalName: {
      type: String,
      required: [true, 'Original file name is required'],
    },
    format: {
      type: String,
      default: '',
    },
    size: {
      type: Number,
      default: 0,
    },
    storage: {
      type: String,
      enum: ['cloudinary', 'local'],
      default: 'local',
    },
  },
  { timestamps: true }
);

const MediaAsset = mongoose.model('MediaAsset', mediaAssetSchema);

export default MediaAsset;
