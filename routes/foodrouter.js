const express = require('express');
const router = express.Router();
const { verifyToken, authorizeRoles , verifyRoomAssigned}= require("../Middleware/authmiddleware");
const foodController = require('../controllers/foodcontroller');

router.post('/create' ,verifyToken, authorizeRoles('manager'), foodController.createFoodItem ); //

router.delete('/delete' ,verifyToken, authorizeRoles('manager'), foodController.deletefood ); //

router.put('/update' ,verifyToken, authorizeRoles('manager'), foodController.updateFoodAvailability); //

router.get('/fetchmenu' ,verifyToken, authorizeRoles('manager'), foodController.fetchmenu); //

router.get('/fetch' ,verifyToken, authorizeRoles('customer'),verifyRoomAssigned, foodController.fetchmenu); //


module.exports = router;