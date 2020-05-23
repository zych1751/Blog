const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Account = mongoose.model('Account');
const jwt = require('jsonwebtoken');

/*
 * ACCOUNT SIGNIN: POST /api/account/signin
 * BODY SAMPLE: { "username": "id", "password": "password" }
 * ERROR CODES:
 *  1: LOGIN FAIL
 *  2: NOT CONFIRMED
 */

router.post('/signin', (req, res) => {
    const { username, password } = req.body;
    const secret = req.app.get('jwtSecret');

    if(typeof password !== "string") {
        return res.status(401).json({
            login: false,
            admin: false,
            error: "LOGIN FAIL",
            code: 1
        });
    }

    Account.findOne({ username: username }, (err, account) => {
        if(err) throw err;

        if(!account || !account.validateHash(password)) {
            return res.status(401).json({
                login: false,
                admin: false,
                error: "LOGIN FAIL",
                code: 1
            });
        }

        if(!account.confirmed) {
            return res.status(401).json({
                login: false,
                admin: false,
                error: "NOT CONFIRMED",
                code: 2
            });
        }

        jwt.sign(
            {
                _id: account._id,
                username: account.username,
                admin: account.admin
            },
            secret,
            {
                expiresIn: '7d',
                subject: 'accountInfo'
            },
            (err, token) => {
                res.json({
                    login: true,
                    admin: account.admin,
                    token: token
                });
            }
        );
    });
});

/*
 * GET CURRENT USER INFO: GET /api/account/info
 */
router.get('/info', (req, res) => {
    const token = req.query.token;

    if(!token) {
        return res.json({
            success: false,
            message: 'No Authentication',
            login: false,
            admin: false
        });
    }

    const p = new Promise(
        (resolve, reject) => {
            jwt.verify(token, req.app.get('jwtSecret'), (err, decoded) => {
                if(err) reject(err);
                resolve(decoded);
            });
        }
    );

    const onError = (err) => {
        res.status(403).json({
            success: false,
            message: err.message,
            login: false,
            admin: false
        });
    };

    p.then((decoded) => {
        req.decoded = decoded
        res.json({
            login: true,
            admin: decoded.admin
        });
    }).catch(onError);
});

/*
 * LOGOUT: POST /api/account/logout
 */

router.post('/logout', (req, res) => {
    res.json({ success: true });
});

module.exports = router;
