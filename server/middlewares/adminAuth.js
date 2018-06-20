const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    const token = req.query.token || req.body.token;

    if(!token) {
        return res.status(403).json({
            success: false,
            message: 'No Authentication'
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
            message: err.message
        });
    };

    p.then((decoded) => {
        req.decoded = decoded
        if(decoded.admin) {
            next();
        } else {
            onError("No Authentication");
        }
    }).catch(onError);
};

module.exports = authMiddleware;
