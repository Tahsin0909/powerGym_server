const jwt = require('jsonwebtoken');
require('dotenv').config();
const secret = process.env.ACCESS_TOKEN_SECRET;


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
        next()
    });
}

const isAdmin = (req, res, next) => {
    const { token } = req.cookies;

    // If the client does not send a token
    if (!token) {
        console.log("token nai");
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
        console.log(" jwt token nai");

            return res.status(401).send({
                "success": false,
                "message": "token err.",
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


module.exports = {
    verifyToken,
    isAdmin
};