const fs = require('fs');
const path = require('path');
const express = require('express');
const userFilePath = path.join(__dirname, '../data/users.json');
const users = JSON.parse(fs.readFileSync(userFilePath, 'utf-8'));
const user = require('../models/user.js')
const bcryptjs = require('bcryptjs');
const {validationResult} = require('express-validator');


const userController = {



    userList : (req,res ) => {
        res.render('users',{user:users})

    },

    userRegister : (req,res) => {
        res.render('register')
    },

    userLogin : (req,res) => {
        res.render('login',{user:req.session.userLogged})
    },


    logicRegister:(req,res) => {

        const resultValidation = validationResult(req);

        if(resultValidation.errors.length > 0) {
            return res.render('register',{
                errors:resultValidation.mapped(),
                oldData : req.body
            })
        }

         let userInDB = user.findByField('mail', req.body.mail); 
        if(userInDB){
            return res.render('register', {
                errors: {
                    mail: {
                        msg: 'Este email ya está registrado'
                    }
                },
                oldData: req.body
            });
            
        } 
        
        let userToCreate = {
            ...req.body,
            image : req.file.filename,
            password: bcryptjs.hashSync(req.body.password,10)
            
        }
        user.create(userToCreate)
        res.redirect('/users/login')
    
    },

    loginLogic: (req,res) =>{
        
        let userToLogin = user.findByField('mail', req.body.mail)

        if (userToLogin){
            let passOk = bcryptjs.compareSync(req.body.password, userToLogin.password);

            if (passOk) {
                
                delete userToLogin.password;
                req.session.userLogged = userToLogin;
                res.cookie('userEmail', req.body.mail, {maxAge: 45000})
                return res.redirect('/')
               
            }


            return res.render('login', {
                errors: {
                    mail: {
                        msg: 'Credenciales Invalidas'
                    }
                }
            })
            
        }

        return res.render('login', {
            errors: {
                mail: {
                    msg: 'No hemos encontrado ese mail, prueba creando una cuenta.'
                }
            }
        })
        
    },

    editUser:(req,res)=>{
        let id = req.params.id;
        let userToEdit = users.find(user => user.id == id);
        res.render('editUser',{user:userToEdit});
    },

    editUserLogic:(req,res) => {
        let id = req.params.id;
        let userToEdit = users.find(user => user.id == id);
        

        let imagen
        (req.files[0] != undefined)
            ? imagen = req.files[0].filename
            : imagen = userToEdit.image

        userToEdit = {
            id: userToEdit.id,
            ...req.body,
            image : imagen
        }
        let editUser = users.map(user => {
            if(user.id == userToEdit.id) {
                return user = {...userToEdit}
            }
            return user
        })
        fs.writeFileSync(userFilePath, JSON.stringify(editUser, null, " "));
        res.redirect("/users")

    },

    logout:(req,res) =>{
        res.clearCookie('userEmail');
        req.session.destroy();
        return res.redirect('/users/login');
        
    }


}





module.exports = userController;