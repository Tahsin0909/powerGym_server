const express = require('express');
const cors = require('cors');
const port = process.env.PORT || 2000;
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
require('dotenv').config();
const secret = process.env.ACCESS_TOKEN_SECRET;

// express app initialization
const app = express();

// app.use(cors())
app.use(cors({
    origin: ['http://localhost:3000'],
    credentials: true
}));


app.use(express.json());
app.use(cookieParser());

// database connection with mongoose
mongoose.connect(`mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.uxzfht6.mongodb.net/${process.env.DB_NAME}`)






// Handle OPTIONS requests
app.options('*', cors());



app.post('/api/v1/logout', async (req, res) => {
    res.clearCookie('token', { maxAge: 0 }).send({ success: true });
});

app.get('/favicon.ico', (req, res) => res.status(204));

// Your existing routes and handlers
app.get('/', (req, res) => {
    res.send("Hello Stranger!!");
});

app.use('/api/users', require('./routeHandler/userHandler'));
app.use('/api/tips', require('./routeHandler/tipsHandler'));
app.use('/api/class', require('./routeHandler/classHandler'));


// default error handler
function errorHandler(err, req, res, next) {
    if (res.headersSent) {
        return next(err);
    }
    console.error(err); // Log the error for debugging
    res.status(500).json({ error: err.message });
}


app.use(errorHandler);


app.listen(port, () => {
    console.log('Server started on port 2000');
});

