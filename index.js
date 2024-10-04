const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
require('dotenv').config();
const secret = process.env.ACCESS_TOKEN_SECRET;

// express app initialization
const app = express();

// app.use(cors())
app.use(cors({
    origin: ['http://localhost:3000', 'https://power-gym-server.vercel.app/', 'https://quickfinance-a948a.firebaseapp.com'],
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// `mongodb+srv://tajisan789:<db_password>@cluster0.uxzfht6.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`
// database connection with mongoose
mongoose.connect(`mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.uxzfht6.mongodb.net/${process.env.DB_NAME}`)
    .then(() => console.log("Connected to MongoDB"))
    .catch(err => console.log("Error connecting to MongoDB", err));



//verify token and grant access
const verifyToken = (req, res, next) => {
    const { token } = req.cookies
    //if client does not send token
    if (!token) {
        return res.status(401).send({ message: 'You are not authorized' })
    }

    // verify a token symmetric
    jwt.verify(token, secret, function (err, decoded) {
        if (err) {
            return res.status(401).send({ message: 'You are not authorized' })
        }
        // attach decoded user so that others can get it
        req.user = decoded
        const Decoded = decoded
        next()
    });
}

const isAdmin = (req, res, next) => {
    const { token } = req.cookies;

    // If the client does not send a token
    if (!token) {
        return res.status(401).send({
            "success": false,
            "message": "Unauthorized access.",
            "errorDetails": "You must be an admin to perform this action."
        }
        );
    }

    // Verify the token
    jwt.verify(token, secret, function (err, decoded) {
        if (err) {
            return res.status(401).send({
                "success": false,
                "message": "Unauthorized access.",
                "errorDetails": "You must be an admin to perform this action."
            }
            );
        }

        // Attach decoded user data to req and check if the user is admin
        if (decoded && decoded.role === 'admin') {
            req.user = decoded; // Attach the decoded token data (e.g., role, userId)
            next(); // Proceed to the next middleware or route
        } else {
            return res.status(403).send({ message: 'Access denied. Admins only.' });
        }
    });
};


module.exports = verifyToken;
module.exports = isAdmin;

// Handle OPTIONS requests
app.options('*', cors());



app.post('/api/v1/logout', async (req, res) => {
    res.clearCookie('token', { maxAge: 0 }).send({ success: true });
});


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
app.listen(2000, () => {
    console.log('Server started on port 2000');
});
