const Users = require('../models/usersmodel'); // User schema
const Rooms = require('../models/roomsmodels'); // Room schema
const Orders = require('../models/ordersmodels');
const Services = require('../models/servicesmodels');
const Food = require('../models/foodmodels');
const bcrypt = require('bcryptjs');
const { generateAccessToken , generateRefreshToken } = require('../Middleware/authmiddleware')
const jwt = require("jsonwebtoken");
// Register a new user
exports.registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const hashedpassword = await bcrypt.hash(password, 10);
    const user = new Users({ name, email, password: hashedpassword });
    await user.save();

    res.status(201).json({ message: 'User registered successfully', user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Handle user checkout
exports.checkoutUser = async (req, res) => {
  try {
    const  roomNo  = req.user.roomNo; 
    const  userId  = req.user.id; 

    // Check if the user has a room
    if (!roomNo) {
      return res.status(400).json({ message: "You don't have a room" });
    }
    // Find the user
    const user = await Users.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Find the room and mark it as available
    const room = await Rooms.findOneAndUpdate(
      { roomNo: roomNo },
      { isBooked: false, customerId: null, bookingDate: null, checkoutDate: new Date() },
      { new: true } // Return the updated document
    );

    // Update the user's roomNo to null
    user.roomNo = null;
    await user.save();

    // Remove all services associated with the roomNo
    await Services.deleteMany({ roomNo: roomNo });

    // Remove all orders associated with the roomNo
    await Orders.deleteMany({ roomNo: roomNo });

    res.status(200).json({ message: 'User checked out successfully', room });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

  exports.loginUser = async (req, res) => {
    try {
      const { email, password } = req.body;
      // Find user by email
      const user = await Users.findOne({ email });
      if (!user) return res.status(404).json({ error: "User not found" });
  
      // Validate password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid)
        return res.status(401).json({ error: "Invalid credentials" });
  
      // Generate JWT
      const accessToken = generateAccessToken(user);
      const refreshToken = generateRefreshToken(user);
      user.refreshToken = refreshToken;
      await user.save();

      res.cookie('refreshToken',refreshToken,{ httpOnly: true , secure: true ,maxAge: 24*60*60*1000});
      return res.status(200).json({ message: "Login successful", accessToken , role: user.role,roomNo: user.roomNo });
    } catch (error) {
      return res.status(500).json({ error:  error.message  });
    }
  };

  exports.logoutUser = async(req ,res) =>{
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) return res.sendStatus(204); // No content, nothing to clear
  
    try {
      // Find user and clear their refresh token
      const user = await Users.findOne({ refreshToken });
      if (!user) return res.sendStatus(204);
  
      user.refreshToken = null;
      await user.save();
  
      // Clear the cookie
      res.clearCookie("refreshToken" , {httpOnly: true , secure: true});
      res.sendStatus(204);
    } catch (error) {
      res.status(500).json({ message: "Internal server error", error });
    }
  }

  exports.handlerefreshtoken = async(req, res) =>{
    console.log('in backend')
    const refreshToken = req.cookies.refreshToken;
    console.log(refreshToken)
    if (!refreshToken) return res.sendStatus(401); // No token provided
  
    try {
      // Find user with the provided refresh token
      const user = await Users.findOne({ refreshToken });
      if (!user) return res.sendStatus(403); // Invalid token
  
      // Verify the refresh token
      jwt.verify(refreshToken, process.env.JWT_REFRESH, (err, decoded) => {
        if (err || decoded.id !== user._id.toString()) return res.sendStatus(403);
  
  
        // Generate new access token
        const accessToken = generateAccessToken(user);
        res.json({ accessToken ,role:user.role,roomNo:user.roomNo});
      });
    } catch (error) {
      res.status(500).json({ message: "Internal server error", error });
    }
  }
  
  
  exports.getAllCustomers = async (req, res) => {
    try {
        // Fetch all users with role 'customer' from the database
        const customers = await Users.find({ role: 'customer' }).select('-password'); // Excluding password field

        // Check if any customers exist
        if (!customers || customers.length === 0) {
            return res.status(404).json({ message: 'No customers found in database' });
        }

        // Return the customers
        return res.status(200).json({
            success: true,
            count: customers.length,
            customers: customers
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Error fetching customers',
            error: error.message
        });
    }
};
 
exports.allusers = async (req, res) => {
  try {
      // Fetch users with roles 'manager' and 'customer' from the database
      const users = await Users.find({
          role: { $in: ['manager', 'customer'] }
      })
          .select('-password') // Exclude password field
          .sort({ role: 1 }); // Sort by role ('manager' comes before 'customer')

      // Check if any users exist
      if (!users || users.length === 0) {
          return res.status(404).json({ message: 'No users found in database' });
      }
      // Return the users
      return res.status(200).json({
          success: true,
          count: users.length,
          users: users
      });

  } catch (error) {
      return res.status(500).json({
          success: false,
          message: 'Error fetching users',
          error: error.message
      });
  }
};

exports.createuser = async (req, res) => {
  try {
    const { name, email, password ,role} = req.body;
    const hashedpassword = await bcrypt.hash(password, 10);
    const user = new Users({ name, email, password: hashedpassword , role: role});
    await user.save();

    res.status(201).json({ message: 'manager created successfully', user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteuser = async(req, res) =>{
  try{
    const { userId } = req.body;
    const deletedUser = await Users.findByIdAndDelete(userId);
    if (!deletedUser) {
      return res.status(404).json({
          success: false,
          message: 'User not found or already deleted',
      });}
      return res.status(200).json({
        success: true,
        message: 'User successfully deleted',
        user: deletedUser, // Optionally include the deleted user's data
    });
  }
  catch(err){
    return res.status(500).json({
      success: false,
      message: 'Error deleting user',
      error: error.message,
  });

  }
}


exports.dashboard = async (req, res) => {
  try {
    const userId = req.user.id;
    const roomNo = req.user.roomNo;
    const user = await Users.findById(userId).select('name roomNo');
    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: 'User not found',
      });
    }
    const room = await Rooms.findOne({ roomNo: roomNo }).select('type bookingDate');
    if (!room) {
      return res.status(404).json({ 
        success: false,
        message: 'Room not found',
      });
    }
    const data = {
      name: user.name,
      roomNo: user.roomNo,
      roomType: room.type,
      checkInDate: room.bookingDate,
    };

    res.status(200).json({ 
      success: true,
      message: 'Dashboard data fetched successfully',
      data: data,
    });
  } catch (error) {
    console.error('Error fetching user details:', error);
    res.status(500).json({ 
      success: false,
      message: 'Internal server error',
      error: error.message,
    });
  }
};


