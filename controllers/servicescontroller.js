const Services = require('../models/servicesmodels'); 
const Users = require('../models/usersmodel'); 
const Rooms = require('../models/roomsmodels');

exports.createService = async (req, res) => {
    try {
      const { roomNo, type, comments } = req.body;
  
      // Validate required fields
      if (!roomNo || !type) {
        return res.status(400).json({ message: 'roomNo and type are required' });
      }
  
      // Create a new service request
      const newService = new Services({
        roomNo,
        type,
        comments: comments || null, // Optional field
        status: 'requested', // Default status
      });
  
      // Save the service request to the database
      await newService.save();
  
      res.status(201).json({ message: 'Service request created successfully', service: newService });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  exports.deleteService = async (req, res) => {
    try {
      const { serviceId } = req.body;
      // Find and delete the service request
      const deletedService = await Services.findByIdAndDelete(serviceId);
  
      if (!deletedService) {
        return res.status(404).json({ message: 'Service request not found' });
      }
  
      res.status(200).json({ message: 'Service request deleted successfully', service: deletedService });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  exports.fetchall = async (req, res) => {
    try {
      const services = await Services.find(); // Fetch all services
      const filteredservices = services.filter((service) => service.status !== 'provided' );
      res.status(200).json({ services: filteredservices });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  exports.updateServiceStatus = async (req, res) => {
    try {
      const { serviceId } = req.body;
      const { status } = req.body;
  
      // Validate the status
      if (!['pending', 'provided'].includes(status)) {
        return res.status(400).json({ message: 'Invalid status value' });
      }
  
      // Find and update the service request
      const updatedService = await Services.findByIdAndUpdate(
        serviceId,
        { status },
        { new: true } // Return the updated document
      );
  
      if (!updatedService) {
        return res.status(404).json({ message: 'Service request not found' });
      }
  
      res.status(200).json({ message: 'Service status updated successfully', service: updatedService });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  exports.completedservices = async (req, res) => {
    try {
      const roomNo = req.user.roomNo; // Corrected: Use req.user.roomNo directly
  
      // Fetch services with status 'provided' for the given room number
      const services = await Services.find({ roomNo: roomNo, status: 'provided' });
  
      res.status(200).json({ 
        success: true,
        message: services.length > 0 ? 'Services fetched successfully' : 'No provided services found',
        completedservices: services,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ 
        success: false,
        message: 'Server error',
        error: error.message,
      });
    }
  };