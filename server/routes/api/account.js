import { Router } from 'express';
import { sign, verify } from 'jsonwebtoken';
import { hashSync, compareSync } from 'bcryptjs';
import mariaDB from '../../models/mariadbIndex';

const router = Router();
const Account = mariaDB.Account;

function generateHash(password) {
    return hashSync(password, 8);
}

function validateHash(password, saltedPassword) {
    return compareSync(password, saltedPassword);
}

/*
 * ACCOUNT SIGNIN: POST /api/account/signin
 * BODY SAMPLE: { "username": "id", "password": "password" }
 * ERROR CODES:
 *  1: LOGIN FAIL
 *  2: NOT CONFIRMED
 */

router.post('/signin', async (req, res) => {
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

    const account = await Account.findOne({
        where: {
            username: username
        }
    });

    if(account === null || !validateHash(password, account.dataValues.password)) {
        return res.status(401).json({
            login: false,
            admin: false,
            error: "LOGIN FAIL",
            code: 1
        });
    }

    const accountData = account.dataValues;
    sign(
        {
            username: accountData.username,
            admin: accountData.admin
        },
        secret,
        {
            expiresIn: '7d',
            subject: 'accountInfo'
        },
        (err, token) => {
            res.json({
                login: true,
                admin: accountData.admin,
                token: token
            });
        }
    );
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
            verify(token, req.app.get('jwtSecret'), (err, decoded) => {
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

export default router;
