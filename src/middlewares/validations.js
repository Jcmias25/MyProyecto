const { body } = require('express-validator');

module.exports = [
    body('name').notEmpty().withMessage('Tienes que escribir un nombre'),
    body('lastname').notEmpty().withMessage('Tienes que escribir un apellido'),
    body('password').notEmpty().withMessage('Tienes que escribir una contraseña'),
    body('email').notEmpty().withMessage('Tienes que escribir un mail').isEmail().withMessage('Tienes que escribir un mail valido'),
    body('age').notEmpty().withMessage('Tienes que escribir una edad'),
    body('image').custom((value, { req }) => {
        let file = req.file;
        if(!file) {
            throw new Error('Tienes que subir una imagen')
        }

        return true;
    })
]