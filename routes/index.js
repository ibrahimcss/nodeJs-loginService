const express = require('express');
const authJwt = require("../middlewares/authJwt");
const router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
    authJwt.verifyToken(req, res, function (err, msg) {
        if (!err) {
            res.render('index', {user_info: msg.message.user_info});

        } else {
            res.redirect("/login")

        }
    })
    //JSON.stringify(req.cookies['x-access-token'])

});
router.post('/', function (req, res, next) {
    authJwt.verifyToken(req, res, function (err, msg) {
        if (!err) {
            res.render('index', {user_info: msg.message.user_info});

        } else {
            res.redirect("/login")

        }
    })
    //JSON.stringify(req.cookies['x-access-token'])

});

module.exports = router;
