import { Router } from 'express';
import { formidable, s3 } from '../../service/UploadImageService';
import { s3 as _s3 } from '../../service/GetImageService';
import { waterfall } from 'async';

const router = Router();

router.post('/upload', (req, res) => {
    const tasks = [
        (callback) => {
            formidable(req, (err, files, field) => {
                callback(err, files);
            })
        }, (files, callback) => {
            s3(files, (err, result) => {
                callback(err, result);
            })
        }
    ];

    waterfall(tasks, (err, result) => {
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

    _s3(imageName, (err, image) => {
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

export default router;
