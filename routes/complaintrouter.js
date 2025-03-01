const express = require('express');
const router = express.Router();
const { verifyToken, authorizeRoles , verifyRoomAssigned}= require("../Middleware/authmiddleware");
const complaintController = require('../controllers/complaintcontroller');

router.post('/create' ,verifyToken, authorizeRoles('customer'),verifyRoomAssigned, complaintController.createcomplaint );

router.get('/getcomplaints' ,verifyToken, authorizeRoles('admin'), complaintController.getcomplaint );

router.put('/markcomplaint' ,verifyToken, authorizeRoles('admin'), complaintController.markcomplaint );

module.exports = router;