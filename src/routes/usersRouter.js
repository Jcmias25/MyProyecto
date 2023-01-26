const fs = require("fs")
const path =require('path');
const express = require('express');
const userController = require('../controllers/userController');
const user = require('../models/user')
const router = express.Router();
const multer = require('multer');
const { body } = require('express-validator');
const guestMiddleware = require('../middlewares/guestMiddleware')
const authMiddleware = require('../middlewares/authMiddleware')

//multer
var storage = multer.diskStorage({
    destination:function(req,file,cb){
        cb(null, 'public/img/users')
    },
    filename: function(req,file,cb){
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
})
var upload = multer({storage: storage})

// validations

const validations = [
    body('name').notEmpty().withMessage('Tienes que escribir un nombre'),
    body('password').notEmpty().withMessage('Tienes que escribir una contraseña'),
    body('mail').notEmpty().withMessage('Tienes que escribir un mail').isEmail().withMessage('Tienes que escribir un mail valido'),
    body('age').notEmpty().withMessage('Tienes que escribir una edad'),
    body('profesion').notEmpty().withMessage('Tienes que escribir una profesion'),
    body('image').custom((value, { req }) => {
        let file = req.file;
        if(!file) {
            throw new Error('Tienes que subir una imagen')
        }

        return true;
    })
]





//Rutas

router.get('/',userController.userList);


router.get('/register',guestMiddleware,userController.userRegister);
router.post('/register',upload.single('image'),validations,userController.logicRegister)

router.get('/login',guestMiddleware,userController.userLogin);
router.post('/login',userController.loginLogic);



router.get('/editUser/:id',userController.editUser);
router.put('/editUser/:id',upload.any(),userController.editUserLogic);

router.get('/logout', userController.logout);

module.exports = router; 