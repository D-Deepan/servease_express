const Complaint = require('../models/complaintmodels'); // Import the Complaint model

exports.createcomplaint = async (req, res) => {
    try {
      const { roomNo, subject, details } = req.body;
  
      if (!roomNo || !subject || !details) {
        return res.status(400).json({ message: 'All fields are required' });
      }
      const customerId = req.user.id;
  
      const newComplaint = new Complaint({ roomNo, customerId, subject, details });
      await newComplaint.save();
  
      res.status(201).json({ message: 'Complaint created successfully', complaint: newComplaint });
    } catch (error) {
      console.error('Error creating complaint:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

exports.getcomplaint = async (req, res) => {
    try {
      const complaints = await Complaint.find({ checked: false });
      res.status(200).json({ complaints });
    } catch (error) {
      console.error('Error fetching complaints:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

exports.markcomplaint = async (req, res) => {
    const { complaintId } = req.body;
    try {
      await Complaint.findByIdAndUpdate(complaintId, { checked: true });
      res.json({ message: "Complaint marked as checked" });
    } catch (error) {
      res.status(500).json({ message: "Error updating complaint" });
    }
  };