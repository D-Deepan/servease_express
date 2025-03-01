const express = require('express');
const router = express.Router();
const roomsController = require('../controllers/roomscontroller');
const { verifyToken, authorizeRoles }= require("../Middleware/authmiddleware");

router.put('/allot', verifyToken, authorizeRoles('manager'), roomsController.allocateRoom);  //

router.put('/checkout', verifyToken, authorizeRoles('manager'),roomsController.deallocateRoom);  //

router.get('/allrooms', verifyToken, authorizeRoles('manager'),roomsController.fetchAllRooms); //

module.exports = router