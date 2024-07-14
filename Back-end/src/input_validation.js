
/* VALIDATING THE CREDENTIALS*/

const { check } = require('express-validator');
const PasswordValidator = require('password-validator');

const passwordSchema = new PasswordValidator();

passwordSchema
    .is().min(8)
    .is().max(50)
    .has().uppercase()
    .has().lowercase()
    .has().digits()
    .has().symbols()
    .has().not().spaces();

const validateUsernameReq = check('username').isLength({ min: 3, max: 20 }).withMessage('Username must be between 3 and 20 characters long');
const validateEmailReq = check('email').isEmail().withMessage('Invalid email format');
const validatePasswordReq = check('password').isLength({ min: 8, max: 50 }).withMessage('Password must be between 8 and 50 characters long')
    .custom((value) => {
        const passwordValidationErrors = passwordSchema.validate(value, { list: true });
        if (passwordValidationErrors.length > 0) {
            throw new Error('Password does not meet the requirements');
        }
        return true;
    });

module.exports = {
    validateUsernameReq,
    validatePasswordReq,
    validateAllReq: [validateUsernameReq, validateEmailReq, validatePasswordReq]
};
