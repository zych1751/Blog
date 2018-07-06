const express = require('express');
const router = express.Router();
const Upload = require('../../service/UploadService');
const async = require('async');

router.post('/upload', (req, res) => {
    const tasks = [
        (callback) => {
            Upload.formidable(req, (err, files, field) => {
                callback(err, files);
            })
        }, (files, callback) => {
            Upload.s3(files, (err, result) => {
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

module.exports = router;
