const express = require('express');
const router = express.Router();
const uploadImage = require('../../service/UploadImageService');
const getImage = require('../../service/GetImageService');
const async = require('async');

router.post('/upload', (req, res) => {
    const tasks = [
        (callback) => {
            uploadImage.formidable(req, (err, files, field) => {
                callback(err, files);
            })
        }, (files, callback) => {
            uploadImage.s3(files, (err, result) => {
                callback(err, files);
            })
        }
    ];

    async.waterfall(tasks, (err, result) => {
        if(!err) {
            res.json({success: true});
        } else {
            res.json({success: false});
        }
    });
});

router.get('/:imageName', (req, res) => {
    const imageName = req.params.imageName;

    if(typeof imageName === "undefined") {
        res.json({success: false});
    }

    getImage.s3(imageName, (err, image) => {
        if(err) {
            res.json({success: false});
        } else {
            res.writeHead(200, {
                'Content-Type': 'image/jpeg',
                'Content-Length': image.Body.length
            });
            res.end(new Buffer(image.Body, 'binary'));
        }
    });
});

module.exports = router;
