import fs from 'fs';
import path from 'path';
import MediaAsset from './media.model.js';
import Profile from '../profile/profile.model.js';
import Project from '../projects/project.model.js';
import Settings from '../settings/settings.model.js';
import { processUploadedFile, cloudinary, isCloudinaryConfigured } from '../../config/cloudinary.js';

// Dedicated controller: Upload Media Asset
export const uploadMedia = async (req, res) => {
  try {
    console.log('Hit uploadMedia api...');
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file was provided for upload',
        data: null,
        error: ['file'],
      });
    }

    const processed = await processUploadedFile(req.file);
    if (!processed) {
      return res.status(500).json({
        success: false,
        message: 'File processing failed',
        data: null,
        error: 'Upload processing error',
      });
    }

    const mediaAsset = new MediaAsset({
      url: processed.url,
      publicId: processed.publicId,
      originalName: processed.originalName,
      format: processed.format,
      size: processed.size,
      storage: processed.storage,
    });

    await mediaAsset.save();

    return res.status(201).json({
      success: true,
      message: 'Asset uploaded successfully',
      data: {
        asset: mediaAsset,
      },
      error: null,
    });
  } catch (error) {
    console.log('failed to handle uploadMedia', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to upload asset',
      data: null,
      error: error.message,
    });
  }
};

// Dedicated controller: Upload Resume PDF
export const uploadResume = async (req, res) => {
  try {
    console.log('Hit uploadResume api...');
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No resume file provided',
        data: null,
        error: ['resume'],
      });
    }

    if (req.file.mimetype !== 'application/pdf') {
      return res.status(400).json({
        success: false,
        message: 'Resume must be a PDF document',
        data: null,
        error: ['mimetype'],
      });
    }

    const processed = await processUploadedFile(req.file);

    // Save as media asset
    const mediaAsset = new MediaAsset({
      url: processed.url,
      publicId: processed.publicId,
      originalName: processed.originalName,
      format: 'pdf',
      size: processed.size,
      storage: processed.storage,
    });
    await mediaAsset.save();

    // Update Profile and Settings resumeUrl
    await Promise.all([
      Profile.updateOne({}, { resumeUrl: processed.url }),
      Settings.updateOne({}, { resumeUrl: processed.url, resumeEnabled: true }),
    ]);

    return res.status(200).json({
      success: true,
      message: 'Resume uploaded and published successfully',
      data: {
        resumeUrl: processed.url,
        asset: mediaAsset,
      },
      error: null,
    });
  } catch (error) {
    console.log('failed to handle uploadResume', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to upload resume',
      data: null,
      error: error.message,
    });
  }
};

// Dedicated controller: Get Public Resume URL
export const getPublicResume = async (req, res) => {
  try {
    console.log('Hit getPublicResume api...');
    const profile = await Profile.findOne().select('resumeUrl fullName');
    if (!profile || !profile.resumeUrl) {
      return res.status(404).json({
        success: false,
        message: 'No resume is currently published',
        data: null,
        error: 'Resume not found',
      });
    }

    if (req.query.download === 'true') {
      return res.redirect(profile.resumeUrl);
    }

    return res.status(200).json({
      success: true,
      message: 'Active resume URL retrieved successfully',
      data: {
        resumeUrl: profile.resumeUrl,
        fullName: profile.fullName,
      },
      error: null,
    });
  } catch (error) {
    console.log('failed to handle getPublicResume', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve resume',
      data: null,
      error: error.message,
    });
  }
};

// Dedicated controller: Get All Media Assets
export const getAllMedia = async (req, res) => {
  try {
    console.log('Hit getAllMedia api...');
    const media = await MediaAsset.find().sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: 'Media assets retrieved successfully',
      data: {
        media,
        total: media.length,
      },
      error: null,
    });
  } catch (error) {
    console.log('failed to handle getAllMedia', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch media assets',
      data: null,
      error: error.message,
    });
  }
};

// Dedicated controller: Delete Media Asset
export const deleteMedia = async (req, res) => {
  try {
    console.log('Hit deleteMedia api...');
    const { id } = req.params;
    const { force } = req.query;

    const asset = await MediaAsset.findById(id);
    if (!asset) {
      return res.status(404).json({
        success: false,
        message: 'Media asset not found',
        data: null,
        error: 'Asset does not exist',
      });
    }

    // Safety check: Prevent deleting media still in use unless force=true
    if (force !== 'true') {
      const [usedInProject, usedInProfile] = await Promise.all([
        Project.findOne({ $or: [{ thumbnail: asset.url }, { screenshots: asset.url }] }).select('title'),
        Profile.findOne({ $or: [{ avatar: asset.url }, { resumeUrl: asset.url }] }).select('fullName'),
      ]);

      if (usedInProject || usedInProfile) {
        return res.status(400).json({
          success: false,
          message: `This asset is currently in use by ${
            usedInProject ? `project "${usedInProject.title}"` : 'your profile'
          }. Update the reference first, or confirm forced deletion.`,
          data: {
            inUse: true,
            usedIn: usedInProject ? `Project: ${usedInProject.title}` : 'Profile',
          },
          error: 'Asset is currently referenced by published content',
        });
      }
    }

    // Delete from Cloudinary if hosted on Cloudinary
    if (asset.storage === 'cloudinary' && isCloudinaryConfigured && asset.publicId) {
      try {
        await cloudinary.uploader.destroy(asset.publicId, {
          resource_type: asset.format === 'pdf' ? 'raw' : 'image',
        });
      } catch (cloudErr) {
        console.warn('Failed to delete asset from Cloudinary:', cloudErr.message);
      }
    }
    // Delete from local filesystem if local storage
    else if (asset.storage === 'local') {
      const filename = path.basename(asset.url);
      const localFilePath = path.resolve('uploads', filename);
      if (fs.existsSync(localFilePath)) {
        try {
          fs.unlinkSync(localFilePath);
        } catch (fsErr) {
          console.warn('Failed to delete local asset file:', fsErr.message);
        }
      }
    }

    await MediaAsset.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: 'Media asset deleted successfully',
      data: null,
      error: null,
    });
  } catch (error) {
    console.log('failed to handle deleteMedia', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete media asset',
      data: null,
      error: error.message,
    });
  }
};
