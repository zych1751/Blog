const AWS = require('aws-sdk');
AWS.config.region = 'ap-northeast-1';
const s3 = new AWS.S3();

const params = {
    Bucket: 'zychspace-image',
    Key: null
};

const GetImageService = {};

GetImageService.s3 = (imageName, callback) => {
    params.Key = imageName;
    s3.getObject(params, (err, result) => {
        callback(err, result);
    });
};

module.exports = GetImageService;
