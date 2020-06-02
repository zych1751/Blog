import { IncomingForm } from 'formidable';
import { config, S3 } from 'aws-sdk';
const Upload = {}

config.region = 'ap-northeast-1';
const s3 = new S3();

const params = {
    Bucket: 'zychspace-image',
    Key: null,
    ACL: 'public-read',
    Body: null
};

Upload.formidable = (req, callback) => {
    const form = new IncomingForm({
        encoding: 'utf-8',
        multiples: true,
        keepExtensions: false
    });

    form.parse(req, (err, fields, files) => {
    });
    form.on('end', function(fields, files) {
        callback(null, this.openedFiles);
    });
    form.on('error', (err) => {
        callback(err, null);
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

export default Upload;
