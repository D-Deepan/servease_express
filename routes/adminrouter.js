const express = require('express');
const router = express.Router();
const { verifyToken, authorizeRoles }= require("../Middleware/authmiddleware");
const usersController = require('../controllers/userscontroller');
const roomsController = require('../controllers/roomscontroller');

router.get('/allusers', verifyToken, authorizeRoles('admin'),usersController.allusers);  //

router.post('/createuser', verifyToken, authorizeRoles('admin'),usersController.createuser);  //

router.delete('/deleteuser', verifyToken, authorizeRoles('admin'),usersController.deleteuser);  //

router.delete('/deleteroom', verifyToken, authorizeRoles('admin'),roomsController.deleteRoom);  //

router.post('/createroom', verifyToken, authorizeRoles('admin'),roomsController.createRoom);  //

router.get('/allrooms', verifyToken, authorizeRoles('admin'),roomsController.fetchAllRooms);  //


module.exports = router;