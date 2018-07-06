const formidable = require('formidable');
const AWS = require('aws-sdk');
const Upload = {}

AWS.config.region = 'ap-northeast-1';
const s3 = new AWS.S3();
const form = new formidable.IncomingForm({
    encoding: 'utf-8',
    multiples: true,
    keepExtensions: false
});

const params = {
    Bucket: 'zychspace-image',
    Key: null,
    ACL: 'public-read',
    Body: null
};

Upload.formidable = (req, callback) => {
    form.parse(req, (err, fields, files) => {
    });
    form.on('error', (err) => {
        callback(err, null);
    });
    form.on('end', function(fields, files) {
        callback(null, this.openedFiles);
    });
    form.on('aborted', () => {
        callback('form.on(aborted)', null);
    });
};

Upload.s3 = (files, callback) => {
    params.Key = files[0].name;
    params.Body = require('fs').createReadStream(files[0].path);
    s3.upload(params, (err, result) => {
        callback(err, result);
    });
};

module.exports = Upload;
