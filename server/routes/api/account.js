const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Account = mongoose.model('Account');
const jwt = require('jsonwebtoken');

/*
 * ACCOUNT SIGNUP: POST /api/account/signup
 * BODY SAMPLE: { "username": "id", "password": "password" }
 * ERROR CODES:
 *  1: BAD USERNAME
 *  2: BAD PASSWORD
 *  3: USERNAME EXISTS
 */

router.post('/signup', (req, res) => {
    let usernameRegex = /^[a-z0-9]+$/;
    const username = req.body.username;
    const password = req.body.password;

    if(!usernameRegex.test(username) || username.length > 12) {
        return res.status(400).json({
            error: "BAD USERNAME",
            code: 1
        });
    }

    if(typeof password !== "string" || password.length < 4) {
        return res.status(400).json({
            error: "BAD PASSWORD",
            code: 2
        });
    }

    Account.findOne({ username: username }, (err, exist) => {
        if(err) throw err;

        if(exist) {
            return res.status(409).json({
                error: "USERNAME EXISTS",
                code: 3
            });
        }

        const account = new Account({
            username: username,
            password: password,
            admin: false
        });

        account.password = account.generateHash(account.password);

        account.save( (err) => {
            if(err) throw err;
            return res.json({ success: true });
        });
    })
});


/*
 * ACCOUNT SIGNIN: POST /api/account/signin
 * BODY SAMPLE: { "username": "id", "password": "password" }
 * ERROR CODES:
 *  1: LOGIN FAIL
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
