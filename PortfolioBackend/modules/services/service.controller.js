import Service from './service.model.js';

// Dedicated controller: Get Public Services (Published only)
export const getPublicServices = async (req, res) => {
  try {
    console.log('Hit getPublicServices api...');
    const services = await Service.find({ isPublished: true }).sort({ order: 1, createdAt: 1 });

    return res.status(200).json({
      success: true,
      message: 'Services retrieved successfully',
      data: {
        services,
        total: services.length,
      },
      error: null,
    });
  } catch (error) {
    console.log('failed to handle getPublicServices', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch public services',
      data: null,
      error: error.message,
    });
  }
};

// Dedicated controller: Get Admin Services
export const getAdminServices = async (req, res) => {
  try {
    console.log('Hit getAdminServices api...');
    const services = await Service.find().sort({ order: 1, createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: 'Admin services retrieved successfully',
      data: {
        services,
        total: services.length,
      },
      error: null,
    });
  } catch (error) {
    console.log('failed to handle getAdminServices', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch admin services',
      data: null,
      error: error.message,
    });
  }
};

// Dedicated controller: Create Service
export const createService = async (req, res) => {
  try {
    console.log('Hit createService api...');
    const incomingData = req.body;

    const requiredFields = ['title', 'description'];
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

    if (typeof incomingData.deliverables === 'string') {
      incomingData.deliverables = incomingData.deliverables
        .split(',')
        .map((d) => d.trim())
        .filter(Boolean);
    }

    const service = new Service(incomingData);
    await service.save();

    return res.status(201).json({
      success: true,
      message: 'Service created successfully',
      data: {
        service,
      },
      error: null,
    });
  } catch (error) {
    console.log('failed to handle createService', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to create service',
      data: null,
      error: error.message,
    });
  }
};

// Dedicated controller: Update Service
export const updateService = async (req, res) => {
  try {
    console.log('Hit updateService api...');
    const { id } = req.params;
    const incomingData = req.body;

    if (typeof incomingData.deliverables === 'string') {
      incomingData.deliverables = incomingData.deliverables
        .split(',')
        .map((d) => d.trim())
        .filter(Boolean);
    }

    const service = await Service.findByIdAndUpdate(id, incomingData, {
      new: true,
      runValidators: true,
    });

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found',
        data: null,
        error: 'Record does not exist',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Service updated successfully',
      data: {
        service,
      },
      error: null,
    });
  } catch (error) {
    console.log('failed to handle updateService', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update service',
      data: null,
      error: error.message,
    });
  }
};

// Dedicated controller: Delete Service
export const deleteService = async (req, res) => {
  try {
    console.log('Hit deleteService api...');
    const { id } = req.params;

    const service = await Service.findByIdAndDelete(id);
    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found',
        data: null,
        error: 'Record does not exist',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Service deleted successfully',
      data: null,
      error: null,
    });
  } catch (error) {
    console.log('failed to handle deleteService', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete service',
      data: null,
      error: error.message,
    });
  }
};
