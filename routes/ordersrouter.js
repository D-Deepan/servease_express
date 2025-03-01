const express = require('express');
const router = express.Router();
const { verifyToken, authorizeRoles , verifyRoomAssigned}= require("../Middleware/authmiddleware");
const ordersController = require('../controllers/orderscontroller');

router.post('/place' ,verifyToken, authorizeRoles('customer'),verifyRoomAssigned, ordersController.placeorder); //

router.get('/fetch' ,verifyToken, authorizeRoles('customer'),verifyRoomAssigned, ordersController.fetchorders);  //

router.get('/fetchall' ,verifyToken, authorizeRoles('manager'), ordersController.fetchorders); //

router.delete('/delete' ,verifyToken, authorizeRoles('customer'),verifyRoomAssigned, ordersController.deleteorder); //

router.get('/servedorders' ,verifyToken, authorizeRoles('customer'),verifyRoomAssigned, ordersController.servedorders); //

router.put('/update' ,verifyToken, authorizeRoles('manager'), ordersController.updatestatus);

module.exports = router;

