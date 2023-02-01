const fs = require('fs');
const path = require('path');
const express = require('express');
/* const userFilePath = path.join(__dirname, '../data/users.json');
const users = JSON.parse(fs.readFileSync(userFilePath, 'utf-8'));
const user = require('../models/user.js') */
const bcryptjs = require('bcryptjs');
const { validationResult } = require('express-validator');
const db = require('../database/models');
const { reset } = require('nodemon');
const sequelize = db.sequelize;


const userController = {



    'userList': async (req, res) => {

        try {

            const users = await db.User.findAll();
            res.render('users', { users });

        } catch (error) {

            console.log(error);

        }



    },

    userRegister: (req, res) => {
        res.render('register')
    },

    userLogin: (req, res) => {
        res.render('login', { user: req.session.userLogged })
    },


    logicRegister: async (req, res) => {

        const resultValidation = validationResult(req);

        if (resultValidation.errors.length > 0) {
            return res.render('register', {
                errors: resultValidation.mapped(),
                oldData: req.body
            })
        } else {
            try {
                let image

                if (req.file != undefined) {
                    image = req.file.filename

                } else {
                    image = 'generic.jpg'
                }

                let newUser = {
                    ...req.body,
                    //encriptamos la pw
                    password: bcryptjs.hashSync(req.body.password, 10),
                    image: image
                }

                await db.User.create(newUser)
                res.redirect('/');
            } catch (error) {
                console.log(error)
            }
        }



    },

    loginLogic: async (req, res) => {

        try {

            let userEmail = req.body.email;
            
            const userFound = await db.User.findOne ({
                where : {
                    email: userEmail
                }
            })
            /* console.log(userFound); */
            if (userFound) {
                if (bcryptjs.compareSync(req.body.password, userFound.password)){
                    req.session.userLogged = userFound;
                    if (req.body.recordarme != undefined) {
                        res.cookie("CookieEmail", userFound.email, {maxAge : 60000 * 15});
                    }
                    
                    res.redirect('/');
                } else {

                    let errors = "Las credenciales son invalidas, prueba nuevamente"
                    res.render('login', {
                        error:errors
                    })
                }


                } else {
                    let errors = "Las credenciales son invalidas, prueba nuevamente"
                    res.render('login', {
                        error:errors
                    })

                }
        } catch (error){
            return console.log(error)
        }
    
    },

    editUser: async (req, res) => {
        try {
            const user = await db.User.findByPk(req.params.id);
            res.render('editUser', { user: user });
        } catch (error) {
            console.log(error);
        }

    },

    editUserLogic: (req, res) => {
        let id = req.params.id;
        let userToEdit = users.find(user => user.id == id);


        let imagen
        (req.files[0] != undefined)
            ? imagen = req.files[0].filename
            : imagen = userToEdit.image

        userToEdit = {
            id: userToEdit.id,
            ...req.body,
            image: imagen
        }
        let editUser = users.map(user => {
            if (user.id == userToEdit.id) {
                return user = { ...userToEdit }
            }
            return user
        })
        fs.writeFileSync(userFilePath, JSON.stringify(editUser, null, " "));
        res.redirect("/users")

    },

    logout: (req, res) => {
        res.clearCookie('CookieEmail');
        req.session.destroy();
        return res.redirect('/users/login');

    }


}





module.exports = userController;