const express = require('express');
const router = express.Router();
const usersController = require('../controllers/userscontroller');
const { verifyToken ,authorizeRoles , verifyRoomAssigned}= require("../Middleware/authmiddleware");

router.post('/register', usersController.registerUser);  //

router.post('/login', usersController.loginUser);  //

router.post('/logout', verifyToken , usersController.logoutUser);  //

router.get('/refresh', usersController.handlerefreshtoken);  //

router.post('/checkout' ,verifyToken , authorizeRoles('customer') , verifyRoomAssigned, usersController.checkoutUser);  //

router.get('/dashboard' ,verifyToken , authorizeRoles('customer') , verifyRoomAssigned ,usersController.dashboard);   //

router.get('/getusers', verifyToken, authorizeRoles('manager'),usersController.getAllCustomers);  //

module.exports = router;
