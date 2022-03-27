const jwt = require("jsonwebtoken");

exports.verifyToken = (req, res, cb) => {
    //let token = req.headers["x-access-token"];
    let token = req.cookies['x-access-token'];
    console.log(`token`, token)
    console.log(`key`, process.env.JWT_SECRET_KEY)
    if (!token) {
        if (cb) cb(true, {status: 403, message: "No token provided!"});
    } else {
        jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
            if (err) {
                if (cb) cb(true, {status: 401, message: "Unauthorized!"});
            } else {
                req.user_info = decoded.user_info;
                if (cb) cb(false, {status: 200, message: {token: token, user_info: decoded.user_info}});
            }

        });
    }


};