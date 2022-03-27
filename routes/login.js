const express = require('express');
const router = express.Router();
const loginController = require('../controllers/login.controller');
const authJwt = require('../middlewares/authJwt')
const cookies = require('cookies')
/* GET users listing. */

router.post('/createuser', function (req, res, next) {
    loginController.signUp(req, res, function (err, msg) {
        if (!err) {
            res.send(msg);
        } else {
            res.send(msg);
        }
    })

});
router.get('/', function (req, res, next) {

    authJwt.verifyToken(req, res, function (err, msg) {
        if (!err) {
            res.redirect('/');
        } else {
            res.render('login');
        }
    })

});

router.get('/logout', function (req, res, next) {
    res.clearCookie("x-access-token");
    res.redirect("/")
})

router.post('/', function (req, res, next) {
    loginController.signIn(req, res, function (err, msg) {
        if (!err) {
            res.cookie("x-access-token", msg.message.accessToken, {maxAge: 900000, httpOnly: true}); //secure: true
            res.redirect("/")
        } else {
            res.send(msg);

        }
    })

});

module.exports = router;
