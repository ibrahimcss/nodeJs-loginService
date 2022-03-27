var express = require('express');
const {verifyToken} = require("../middlewares/authJwt");
const authJwt = require("../middlewares/authJwt");
var router = express.Router();

/* GET users listing. */
router.get('/', function (req, res, next) {

    authJwt.verifyToken(req, res, function (err, msg) {
        if (!err) {
            //res.render('users', { user_info: msg.message.user_info });
            res.send(`users`)
        } else {
            res.redirect('/login');
        }
    })
});

module.exports = router;
