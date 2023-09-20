const express = require("express");
const cookieParser = require('cookie-parser');
const errorMiddleware = require('./middleware/error');
const bodyParser = require('body-parser');
const fileUpload  = require('express-fileupload')
const dotenv = require('dotenv')
const path = require('path');


const app = express();
 
// Config
dotenv.config({path: "backend/config/config.env"})

app.use(express.json()); 
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: true}))
app.use(fileUpload());


// import Routes
const product = require('./routes/productRoute');
const user = require("./routes/userRoute");
const order = require('./routes/orderRoute');
const payment = require('./routes/paymentRoute')


// Route Imports
app.use('/api/v1', product)
app.use('/api/v1', user)
app.use('/api/v1', order)
app.use('/api/v1', payment)

app.use(express.static(path.join(__dirname,"../backend/build")))

app.get("*", (req, res) => {
    console.log("first")
    res.sendFile(path.resolve(__dirname,"../backend/build/index.html"))
})

// Middleware for error
app.use(errorMiddleware);


module.exports = app;  