import { config, S3 } from 'aws-sdk';
config.region = 'ap-northeast-1';
const s3 = new S3();

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

export default GetImageService;
