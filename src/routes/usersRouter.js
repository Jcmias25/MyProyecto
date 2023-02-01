const fs = require("fs")
const path =require('path');
const express = require('express');
const userController = require('../controllers/userController');
const user = require('../models/user')
const router = express.Router();
const multer = require('multer');
const { body } = require('express-validator');

//middlewares
const guestMiddleware = require('../middlewares/guestMiddleware')
const authMiddleware = require('../middlewares/authMiddleware')
const validations = require('../middlewares/validations')

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


//Rutas

router.get('/',userController.userList);

//Registro
router.get('/register',guestMiddleware,userController.userRegister);
router.post('/register',upload.single('image'),validations,userController.logicRegister)

//Login
router.get('/login',guestMiddleware,userController.userLogin);
router.post('/login',userController.loginLogic);

//Edit User
router.get('/editUser/:id',userController.editUser);
router.put('/editUser/:id',upload.any(),userController.editUserLogic);

router.get('/logout', userController.logout);

module.exports = router; 