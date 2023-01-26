const fs = require("fs")
const path =require('path');
const express = require('express');
const mainController = require('../controllers/mainController');
const router =express.Router();
const authMiddleware = require('../middlewares/authMiddleware')


//RUTAS

router.get('/',authMiddleware ,mainController.home);



//Exportamos modulo

module.exports = router
