const fs = require('fs');
const path = require('path');
const express = require('express');
const userFilePath = path.join(__dirname, '../data/users.json');
const users = JSON.parse(fs.readFileSync(userFilePath, 'utf-8'));


const mainController = {

    home: (req,res) => {

        userInSession = req.session.userLogged;
        res.render('home',{user:userInSession})

    }
}


module.exports = mainController;