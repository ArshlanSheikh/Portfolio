import Inquiry from './inquiry.model.js';

// Email regex pattern
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Dedicated controller: Public Submit Inquiry
export const createInquiry = async (req, res) => {
  try {
    console.log('Hit createInquiry api...');
    const incomingData = req.body;

    // 1. Anti-Spam Honeypot check
    // If the hidden honeypot field is filled, silently succeed without storing to fool bots
    if (incomingData._gotcha || incomingData.hp || incomingData.website_trap) {
      console.log('Spam bot detected via honeypot trap. Silently dropping submission.');
      return res.status(200).json({
        success: true,
        message: 'Thank you for reaching out! Your message has been received.',
        data: null,
        error: null,
      });
    }

    // 2. Required field validation
    const requiredFields = ['name', 'email', 'subject', 'message'];
    const missingFields = requiredFields.filter((item) => {
      return (
        incomingData[item] === null ||
        incomingData[item] === undefined ||
        incomingData[item] === ''
      );
    });

    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Required fields are missing',
        data: null,
        error: missingFields,
      });
    }

    const { name, email, company, inquiryType, subject, message } = incomingData;

    const VALID_INQUIRY_TYPES = [
      'Project Consultation',
      'Freelance Work',
      'Full-time Opportunity',
      'Mentorship',
      'General Inquiry',
    ];

    // 3. Length & Format validation
    const errors = [];
    if (inquiryType && !VALID_INQUIRY_TYPES.includes(inquiryType)) {
      errors.push(`Inquiry type must be one of: ${VALID_INQUIRY_TYPES.join(', ')}`);
    }
    if (typeof name !== 'string' || name.trim().length > 100) {
      errors.push('Name cannot exceed 100 characters');
    }
    if (typeof email !== 'string' || !EMAIL_REGEX.test(email.trim())) {
      errors.push('Please provide a valid email address');
    }
    if (email.trim().length > 150) {
      errors.push('Email cannot exceed 150 characters');
    }
    if (company && company.trim().length > 100) {
      errors.push('Company cannot exceed 100 characters');
    }
    if (typeof subject !== 'string' || subject.trim().length > 200) {
      errors.push('Subject cannot exceed 200 characters');
    }
    if (typeof message !== 'string' || message.trim().length < 10) {
      errors.push('Message must be at least 10 characters');
    }
    if (message.trim().length > 4000) {
      errors.push('Message cannot exceed 4000 characters');
    }

    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Input validation failed',
        data: null,
        error: errors,
      });
    }

    // 4. Capture Client IP address for auditing
    const ipAddress =
      req.headers['x-forwarded-for']?.split(',')[0] || req.socket?.remoteAddress || '';

    const inquiry = new Inquiry({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      company: (company || '').trim(),
      inquiryType: inquiryType || 'Project Consultation',
      subject: subject.trim(),
      message: message.trim(),
      ipAddress,
      status: 'New',
      isRead: false,
    });

    await inquiry.save();

    return res.status(201).json({
      success: true,
      message: 'Thank you for reaching out! Your inquiry has been submitted successfully.',
      data: {
        id: inquiry._id,
        createdAt: inquiry.createdAt,
      },
      error: null,
    });
  } catch (error) {
    console.log('failed to handle createInquiry', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to submit inquiry. Please try again later.',
      data: null,
      error: error.message,
    });
  }
};

// Dedicated controller: Admin Get All Inquiries
export const getAdminInquiries = async (req, res) => {
  try {
    console.log('Hit getAdminInquiries api...');
    const { status, inquiryType, search } = req.query;
    const filter = {};

    if (status && status !== 'All') {
      filter.status = status;
    }

    if (inquiryType && inquiryType !== 'All') {
      filter.inquiryType = inquiryType;
    }

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { subject: { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } },
      ];
    }

    const inquiries = await Inquiry.find(filter).sort({ createdAt: -1 });
    const unreadCount = await Inquiry.countDocuments({ isRead: false });

    return res.status(200).json({
      success: true,
      message: 'Inquiries retrieved successfully',
      data: {
        inquiries,
        total: inquiries.length,
        unreadCount,
      },
      error: null,
    });
  } catch (error) {
    console.log('failed to handle getAdminInquiries', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch inquiries',
      data: null,
      error: error.message,
    });
  }
};

// Dedicated controller: Admin Get Inquiry Details (marks as read)
export const getInquiryById = async (req, res) => {
  try {
    console.log('Hit getInquiryById api...');
    const { id } = req.params;

    const inquiry = await Inquiry.findById(id);
    if (!inquiry) {
      return res.status(404).json({
        success: false,
        message: 'Inquiry not found',
        data: null,
        error: 'Inquiry does not exist',
      });
    }

    // Automatically mark inquiry as read if not already read
    if (!inquiry.isRead) {
      inquiry.isRead = true;
      if (inquiry.status === 'New') {
        inquiry.status = 'Reviewed';
      }
      await inquiry.save();
    }

    return res.status(200).json({
      success: true,
      message: 'Inquiry retrieved successfully',
      data: {
        inquiry,
      },
      error: null,
    });
  } catch (error) {
    console.log('failed to handle getInquiryById', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch inquiry details',
      data: null,
      error: error.message,
    });
  }
};

// Dedicated controller: Admin Update Inquiry Status
export const updateInquiryStatus = async (req, res) => {
  try {
    console.log('Hit updateInquiryStatus api...');
    const { id } = req.params;
    const { status, isRead } = req.body;

    const validStatuses = ['New', 'Reviewed', 'Contacted', 'Archived'];
    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`,
        data: null,
        error: ['status'],
      });
    }

    const updateFields = {};
    if (status) updateFields.status = status;
    if (typeof isRead === 'boolean') updateFields.isRead = isRead;

    const inquiry = await Inquiry.findByIdAndUpdate(id, updateFields, { new: true });
    if (!inquiry) {
      return res.status(404).json({
        success: false,
        message: 'Inquiry not found',
        data: null,
        error: 'Inquiry does not exist',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Inquiry status updated successfully',
      data: {
        inquiry,
      },
      error: null,
    });
  } catch (error) {
    console.log('failed to handle updateInquiryStatus', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update inquiry status',
      data: null,
      error: error.message,
    });
  }
};

// Dedicated controller: Admin Delete Inquiry
export const deleteInquiry = async (req, res) => {
  try {
    console.log('Hit deleteInquiry api...');
    const { id } = req.params;

    const inquiry = await Inquiry.findByIdAndDelete(id);
    if (!inquiry) {
      return res.status(404).json({
        success: false,
        message: 'Inquiry not found',
        data: null,
        error: 'Inquiry does not exist',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Inquiry deleted successfully',
      data: null,
      error: null,
    });
  } catch (error) {
    console.log('failed to handle deleteInquiry', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete inquiry',
      data: null,
      error: error.message,
    });
  }
};
