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
 *  3: BAD EMAIL
 *  4: USERNAME EXISTS
 *  5: EMAIL EXISTS
 */

router.post('/signup', (req, res) => {
    let usernameRegex = /^[a-z0-9]+$/;
    const username = req.body.username;
    const password = req.body.password;
    const email = req.body.email;

    if(!usernameRegex.test(username) || username.length > 12) {
        return res.status(400).json({
            error: "BAD USERNAME",
            code: 1
        });
    }

    if(typeof password !== "string" || password.length < 8 || password.length > 20) {
        return res.status(400).json({
            error: "BAD PASSWORD",
            code: 2
        });
    }

    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if(!re.test(email.toLowerCase())) {
        return res.status(400).json({
            error: "BAD EMAIL",
            code: 3
        });
    }

    Account.findOne({ username: username }, (err, exist) => {
        if(err) throw err;

        if(exist) {
            return res.status(409).json({
                error: "USERNAME EXISTS",
                code: 4
            });
        }

        Account.findOne({ email: email}, (err, exist) => {
            if(err) throw err;

            if(exist) {
                return res.status(409).json({
                    error: "EMAIL EXISTS",
                    code: 5
                });
            }

            const account = new Account({
                username: username,
                password: password,
                email: email,
                admin: false
            });

            account.password = account.generateHash(account.password);
            account.confirmCode = account.generateConfirmCode();

            account.save( (err) => {
                if(err) throw err;

                const sgMail = require('@sendgrid/mail');
                const link = 'https://zychspace.com/confirm/'+account.username+'/'+account.confirmCode;
                sgMail.setApiKey(process.env.SENDGRID_API_KEY);
                const msg = {
                    to: email,
                    from: 'admin@zychspace.com',
                    subject: 'zychspace.com의 회원가입 메일입니다.',
                    html: 'zychspace.com의 회원가입 메일입니다.<br>회원가입을 하려고 하는게 맞다면 아래 링크로 들어가주세요.<br><a href="'+link+'">'+link+'</a>',
                };
                sgMail.send(msg);

                res.json({
                    success: true,
                    confirmCode: account.confirmCode
                });
            });
        });
    })
});

/*
 * ACCOUNT CONFIRM: POST /api/account/confirm
 * BODY SAMPLE: { "username": "id", "confirmCode": "abcdefg" }
 * ERROR CODES:
 *  1: BAD USERNAME
 *  2: BAD CONFIRM CODE
 */

router.post('/confirm', (req, res) => {
    const username = req.body.username;
    const confirmCode = req.body.confirmCode;
    Account.findOne({username: username}, (err, user) => {
        if(err) throw err;

        if(!user) {
            return res.json({
                error: "BAD USERNAME",
                code: 1
            });
        }

        if(user.confirmCode == confirmCode) {
            user.confirmed = true;
            user.save((err) => {
                if(err) throw err;
                return res.json({ success: true});
            });
        } else {
            return res.json({
                error: "BAD CONFIRM CODE",
                code: 2
            });
        }
    });
});


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
