const db = require("../models");
const {user: User, role: Role, refreshToken: RefreshToken} = db;
const ROLES = db.ROLES;

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.signUp = (req, res, cb) => {
    db.user.findOne({
        username: req.body.username
    }).exec((err, user) => {
        if (err) {
            if (cb) cb(true, {status: 500, message: err});

        } else if (user) {
            if (cb) cb(true, {status: 400, message: "Failed! Username is already in use!"});

        } else {
            db.user.findOne({
                email: req.body.email
            }).exec((err, email) => {
                if (err) {
                    if (cb) cb(true, {status: 500, message: err});

                } else if (email) {
                    if (cb) cb(true, {status: 400, message: "Failed! Email is already in use!"});

                } else {
                    if (req.body.roles) {
                        for (let i = 0; i < req.body.roles.length; i++) {
                            if (!ROLES.includes(req.body.roles[i])) {
                                if (cb) cb(true, {
                                    status: 400,
                                    message: `Failed! Role ${req.body.roles[i]} does not exist!`
                                });
                                return;
                            }
                        }
                    }
                    mongoDB.getLastSequnceValue('User_id', function (seqVal) {
                        const userNew = new User({
                            _id: seqVal,
                            username: req.body.username,
                            email: req.body.email,
                            password: bcrypt.hashSync(req.body.password, 8),
                            createDate: new Date()
                        });
                        userNew.save((err, user) => {
                            if (err) {
                                if (cb) cb(true, {status: 500, message: err});

                            } else {
                                if (req.body.roles) {

                                    Role.find(
                                        {
                                            name: {$in: req.body.roles},
                                        },
                                        (err, roles) => {
                                            if (err) {
                                                if (cb) cb(true, {status: 500, message: err});


                                            } else {
                                                user.roles = roles.map((role) => role._id);
                                                user.save((err) => {
                                                    if (err) {
                                                        if (cb) cb(true, {status: 500, message: err});


                                                    } else {
                                                        if (cb) cb(false, {
                                                            status: 200,
                                                            message: "User was registered successfully!"
                                                        });

                                                    }
                                                });
                                            }
                                        }
                                    );
                                } else {
                                    Role.findOne({name: "user"}, (err, role) => {
                                        if (err) {
                                            if (cb) cb(true, {status: 500, message: err});


                                        } else {
                                            user.roles = [role._id];
                                            user.save((err) => {
                                                if (err) {
                                                    if (cb) cb(true, {status: 500, message: err});


                                                } else {
                                                    if (cb) cb(false, {
                                                        status: 200,
                                                        message: "User was registered successfully!"
                                                    });

                                                }

                                            });
                                        }

                                    });
                                }
                            }
                        });
                    });
                }
            });
        }
    });
}

exports.signIn = (req, res, cb) => {
    User.findOne({
        username: req.body.username,
    })
        .populate("roles", "-__v")
        .exec(async (err, user) => {
            if (err) {
                if (cb) cb(true, {status: 500, message: err});
            } else {
                if (!user) {
                    if (cb) cb(true, {status: 404, message: "User Not found."});
                } else {
                    let passwordIsValid = bcrypt.compareSync(
                        req.body.password,
                        user.password
                    );
                    if (!passwordIsValid) {
                        return res.status(401).send({
                            accessToken: null,
                            message: "Invalid Password!",
                        });
                        if (cb) cb(true, {status: 401, message: "Invalid Password!"});
                    } else {
                        console.log(`key`, process.env.JWT_SECRET_KEY)
                        let token = jwt.sign({
                                user_info: user,
                                exp: Math.floor(Date.now() / 1000) + (process.env.JWT_EXPIRATION_MINUTE * 1),
                                iat: Math.floor(Date.now())
                            },
                            process.env.JWT_SECRET_KEY);

                        //let refreshToken = await RefreshToken.createToken(user);
                        //refreshToken: refreshToken,
                        let authorities = [];

                        for (let i = 0; i < user.roles.length; i++) {
                            authorities.push("ROLE_" + user.roles[i].name.toUpperCase());
                        }
                        if (cb) cb(false, {
                            status: 200, message: {
                                id: user._id,
                                username: user.username,
                                email: user.email,
                                roles: authorities,
                                accessToken: token,

                            }
                        });
                    }
                }


            }


        });

}
