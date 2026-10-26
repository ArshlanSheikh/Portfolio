import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Check if Cloudinary is configured
const isCloudinaryConfigured = Boolean(
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET
);

if (isCloudinaryConfigured) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
  console.log('Cloudinary storage initialized.');
} else {
  console.log('Cloudinary credentials not provided. Using local disk storage fallback.');
}

// Local storage configuration
const uploadsDir = path.resolve('uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const diskStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = [
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/gif',
    'image/svg+xml',
    'application/pdf',
  ];
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Unsupported file type. Only JPEG, PNG, WEBP, GIF, SVG, and PDF are allowed.'), false);
  }
};

export const upload = multer({
  storage: diskStorage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter,
});

/**
 * Upload helper that handles Cloudinary upload when configured,
 * otherwise returns local path accessible via /uploads/ filename.
 */
export const processUploadedFile = async (file) => {
  if (!file) return null;

  if (isCloudinaryConfigured) {
    try {
      const result = await cloudinary.uploader.upload(file.path, {
        folder: 'portfolio',
        resource_type: file.mimetype === 'application/pdf' ? 'raw' : 'image',
      });
      // Optionally remove temp local file
      if (fs.existsSync(file.path)) {
        fs.unlinkSync(file.path);
      }
      return {
        url: result.secure_url,
        publicId: result.public_id,
        format: result.format || path.extname(file.originalname).replace('.', ''),
        size: result.bytes || file.size,
        originalName: file.originalname,
        storage: 'cloudinary',
      };
    } catch (error) {
      console.warn('Cloudinary upload failed, falling back to local file:', error.message);
    }
  }

  // Local fallback
  return {
    url: `/uploads/${file.filename}`,
    publicId: file.filename,
    format: path.extname(file.originalname).replace('.', ''),
    size: file.size,
    originalName: file.originalname,
    storage: 'local',
  };
};

export { cloudinary, isCloudinaryConfigured };
