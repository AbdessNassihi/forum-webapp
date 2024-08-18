const multer = require('multer');
const path = require('path');


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '_' + file.originalname);
    }
});

const imageFilter = function (req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
        return cb(new Error('Invalid file type'), false);
    }
    cb(null, true);
};

const getImagePath = (req, user, profileImage) => {
    if (req.file) {
        return req.file.path;
    }
    if (user) { return user.img_url }
    else {
        if (profileImage) return path.join('/uploads', 'default_ProfileImage.jpg');
        else { return path.join('/uploads', 'default_ThreadImage.jpg') }

    }

}

const upload = multer({ storage: storage, fileFilter: imageFilter });


const handleImageUpload = (req, res, next) => {
    upload.single('image')(req, res, (err) => {

        if (err) {
            let errors = [];
            errors.push({ path: 'image', msg: err.message });
            return res.status(400).json({ code: 400, status: 'Bad Request', errors: errors });
        }
        next();
    });
};
module.exports = {
    handleImageUpload,
    getImagePath
};