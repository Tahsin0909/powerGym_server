const express = require('express');
const cors = require('cors');
const port = process.env.PORT || 2000;
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
require('dotenv').config();
const secret = process.env.ACCESS_TOKEN_SECRET;

// Check if secret exists
if (!secret) {
    throw new Error("ACCESS_TOKEN_SECRET is not defined in environment variables");
}

// express app initialization
const app = express();

// Cors configuration
app.use(cors({
    origin: ['http://localhost:3000', 'https://power-gym-sable.vercel.app/'],
    credentials: true
}));

app.use(express.json());
app.use(cookieParser());

// database connection with mongoose
mongoose.connect(`mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.uxzfht6.mongodb.net/${process.env.DB_NAME}`)
    .then(() => console.log("Connected to MongoDB"))
    .catch(err => {
        console.log("Error connecting to MongoDB", err);
        process.exit(1);  // Stop the app if there's a database connection issue
    });

//verify token and grant access
const verifyToken = (req, res, next) => {
    const { token } = req.cookies;
    if (!token) {
        return res.status(401).send({ message: 'You are not authorized' });
    }

    // verify a token symmetric
    jwt.verify(token, secret, function (err, decoded) {
        if (err) {
            return res.status(401).send({ message: 'You are not authorized', error: err.message });
        }
        req.user = decoded;
        next();
    });
}

const isAdmin = (req, res, next) => {
    const { token } = req.cookies;

    if (!token) {
        return res.status(401).send({
            success: false,
            message: "Unauthorized access.",
            errorDetails: "You must be an admin to perform this action."
        });
    }

    jwt.verify(token, secret, function (err, decoded) {
        if (err) {
            return res.status(401).send({
                success: false,
                message: "token err.",
                errorDetails: "You must be an admin to perform this action."
            });
        }

        if (decoded && decoded.role === 'admin') {
            req.user = decoded;
            next();
        } else {
            return res.status(403).send({ message: 'Access denied. Admins only.' });
        }
    });
};

app.options('*', cors());

// Logout route
app.post('/api/v1/logout', async (req, res) => {
    res.clearCookie('token', { maxAge: 0 }).send({ success: true });
});

// Favicon route to prevent errors
app.get('/favicon.ico', (req, res) => res.status(204));

// Routes
app.get('/', (req, res) => {
    res.send("Hello Stranger!!");
});

app.use('/api/users', require('./routeHandler/userHandler'));
app.use('/api/tips', require('./routeHandler/tipsHandler'));
app.use('/api/class', require('./routeHandler/classHandler'));

// Error handler
function errorHandler(err, req, res, next) {
    if (res.headersSent) {
        return next(err);
    }
    console.error(err);
    res.status(500).json({ error: err.message });
}

app.use(errorHandler);

app.listen(port, () => {
    console.log('Server started on port 2000');
});

module.exports = { verifyToken, isAdmin };
