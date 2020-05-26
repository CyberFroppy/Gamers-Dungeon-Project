const jwt = require("jsonwebtoken");
const {
    API_SECRET
} = require('../config');

function validate(admin) {
    return function(req, res, next) {
        let token = req.headers.sessiontoken;
        if (!token) {
            res.statusMessage = "No authentication token sent";
            return res.status(406).end();
        }

        return jwt.verify(token, API_SECRET, (err, decoded) => {
            if(err) {
                res.statusMessage = "Expired session, log in again";
                return res.status(409).end();
            }
            if(admin && decoded.userType !== 'admin') {
                res.statusMessage = "Reserved for admin";
                return res.status(409).end();
            }
            req.user = decoded;
            next();
        });
    };
}

module.exports = {validate};
