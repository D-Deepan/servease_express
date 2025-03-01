const express = require('express');
const router = express.Router();
const servicescontroller = require('../controllers/servicescontroller');
const { verifyToken, verifyRoomAssigned, authorizeRoles }= require("../Middleware/authmiddleware");

router.post('/createservice' ,verifyToken, authorizeRoles('customer'),verifyRoomAssigned, servicescontroller.createService);  //

router.get('/fetchservices' ,verifyToken, authorizeRoles('customer'),verifyRoomAssigned, servicescontroller.fetchall);  //

router.get('/fetchall' ,verifyToken, authorizeRoles('manager'), servicescontroller.fetchall);  //

router.get('/completedservice' ,verifyToken, authorizeRoles('customer'),verifyRoomAssigned, servicescontroller.completedservices);

router.delete('/deleteservice' ,verifyToken, authorizeRoles('customer'),verifyRoomAssigned, servicescontroller.deleteService);

router.put('/updateservice' ,verifyToken, authorizeRoles('manager'), servicescontroller.updateServiceStatus);  //


module.exports = router;