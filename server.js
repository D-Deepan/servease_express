// app.js
const express = require('express');
const connectDB = require('./config/db'); 
const servicesRouter = require('./routes/servicesrouter');
const foodRouter = require('./routes/foodrouter');
const ordersRouter = require('./routes/ordersrouter');
const usersRouter = require('./routes/usersrouter');
const roomsRouter = require('./routes/roomsrouter');
const complaintRouter = require('./routes/complaintrouter');

const cookieParser = require("cookie-parser");
const adminrouter = require('./routes/adminrouter');
const cors = require('cors');
const corsOptions = require('./config/corsOption');
require("dotenv").config({ path: "./.env" });



//const foodRouter = require('./routes/foodrouter');
const app = express();
app.use(cookieParser());
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
connectDB();
app.get('/',(req, res) =>{
   res.send("home");
});
//app.use('/services/laundry', laundryRouter);
//app.use('/services/amenities', amenitiesRouter);
app.use('/admin',adminrouter);
app.use('/users', usersRouter);
app.use('/rooms', roomsRouter);
app.use('/food',foodRouter);
app.use('/orders',ordersRouter);
app.use('/services',servicesRouter);
app.use('/complaints',complaintRouter);

//app.use('/services/food', foodRouter);



app.listen(5000, () => {
  console.log('Server is running on port 5000');
});
