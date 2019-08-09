const aws = require('aws-sdk');
const fs = require('fs');

let secrets;

if (process.env.NODE_ENV == 'production') {
    secrets = process.env;
} else {
    secrets = require('./secrets');
}

const s3 = new aws.S3({
    accessKeyId: secrets.AWS_KEY,
    secretAccessKey: secrets.AWS_SECRET
});

exports.upload = (req, res, next) => {
    const {
        file
    } = req;
    if (!file) {
        console.log('Multer failed :(');
        return res.sendStatus(500);
    }
    const {
        filename,
        mimetype,
        size,
        path
    } = req.file;

    s3.putObject({
        Bucket: 'spiced-imageboard',
        ACL: 'public-read',
        Key: filename,
        Body: fs.createReadStream(path),
        ContentType: mimetype,
        ContentLength: size
    }).promise().then(data => {
        console.log(data);
        next();
    }).catch(err => {
        console.log(err);
        res.sendStatus(500);
    }).then(
        () => fs.unlink(path, () => {})
    );
};
