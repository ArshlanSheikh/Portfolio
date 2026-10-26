import mongoose from 'mongoose';

const blogPostSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Blog post title is required'],
      trim: true,
    },
    slug: {
      type: String,
      required: [true, 'Post slug is required'],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    summary: {
      type: String,
      required: [true, 'Post summary is required'],
    },
    content: {
      type: String,
      required: [true, 'Article content is required'],
    },
    coverImage: {
      type: String,
      default: '',
    },
    tags: [
      {
        type: String,
      },
    ],
    category: {
      type: String,
      default: 'Engineering',
      index: true,
    },
    readTime: {
      type: String,
      default: '5 min read',
    },
    publishedAt: {
      type: Date,
      default: Date.now,
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

const BlogPost = mongoose.model('BlogPost', blogPostSchema);

export default BlogPost;
