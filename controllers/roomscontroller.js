const Rooms = require('../models/roomsmodels');
const Users = require('../models/usersmodel'); // User schema
const Orders = require('../models/ordersmodels');
const Services = require('../models/servicesmodels');

exports.allocateRoom = async (req, res) => {
    try {
      const { userId, roomNo } = req.body;
      const user = await Users.findById(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      const room = await Rooms.findOne({ roomNo });
      if (!room) {
        return res.status(404).json({ message: 'Room not found' });
      }
  
      if (room.isBooked) {
        return res.status(400).json({ message: 'Room is already booked' });
      }
  
      // Update user's roomNo and room's customerId
      user.roomNo = roomNo;
      await user.save();
  
      room.isBooked = true;
      room.customerId = userId;
      room.bookingDate = new Date();
      room.checkoutDate = null; // Reset checkout date
      await room.save();
  
      res.status(200).json({ message: 'Room allotted successfully', room });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

exports.deallocateRoom = async (req, res) => {
    try {
      const { userId } = req.body;
  
      // Find the user
      const user = await Users.findById(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Check if the user has a room allocated
      if (!user.roomNo) {
        return res.status(400).json({ message: 'User has no room allocated' });
      }
      const roomNo = user.roomNo;
      // Find the room allocated to the user
      const room = await Rooms.findOne({ roomNo: user.roomNo });
      if (!room) {
        return res.status(404).json({ message: 'Room not found' });
      }
  
      // Check if the room is already deallocated
      if (!room.isBooked) {
        return res.status(400).json({ message: 'Room is already available' });
      }
      
      // Update user's roomNo to null
      user.roomNo = null;
      await user.save();
  
      // Update room's status to available
      room.isBooked = false;
      room.customerId = null;
      room.bookingDate = null;
      room.checkoutDate = new Date(); // Set checkout date
      await room.save();
      await Services.deleteMany({ roomNo: roomNo });
  
      await Orders.deleteMany({ roomNo: roomNo });    
  
      res.status(200).json({ message: 'Room deallocated successfully', room });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  exports.createRoom = async (req, res) => {
    try {
      const { roomNo, type, price } = req.body;
  
      // Validate required fields
      if (!roomNo || !type || !price) {
        return res.status(400).json({ error: 'roomNo, type, and price are required' });
      }
  
      // Check if the room already exists
      const existingRoom = await Rooms.findOne({ roomNo });
      if (existingRoom) {
        return res.status(409).json({ error: `Room with roomNo ${roomNo} already exists` });
      }
  
      // Create a new room
      const newRoom = new Rooms({
        roomNo,
        type,
        price
      });
  
      // Save to the database
      await newRoom.save();
  
      res.status(201).json({ message: 'Room created successfully', room: newRoom });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to create room', details: error.message });
    }
  };

  exports.deleteRoom = async (req, res) => {
    try {
        const { roomNo } = req.body; // Assuming roomNo is passed as a URL parameter

        // Validate required field
        if (!roomNo) {
            return res.status(400).json({ error: 'roomNo is required' });
        }

        // Check if the room exists
        const existingRoom = await Rooms.findOne({ roomNo });
        if (!existingRoom) {
            return res.status(404).json({ error: `Room with roomNo ${roomNo} not found` });
        }

        // Delete the room
        await Rooms.deleteOne({ roomNo });

        res.status(200).json({ message: `Room with roomNo ${roomNo} deleted successfully` });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to delete room', details: error.message });
    }
};

exports.fetchAllRooms = async (req, res) => {
  try {
      // Fetch all rooms from the database
      const rooms = await Rooms.find({});

      // Check if any rooms exist
      if (rooms.length === 0) {
          return res.status(404).json({ message: 'No rooms found' });
      }

      // Return the list of rooms
      res.status(200).json({ message: 'Rooms fetched successfully', rooms :rooms});
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to fetch rooms', details: error.message });
  }
};