const fs = require('fs');
const path = require('path')
const user = {
    //cosas necesarias
    fileName: path.join(__dirname, '../data/users.json'),

    getData: function() {

        return JSON.parse(fs.readFileSync(this.fileName, 'utf-8'));
    },

    findAll: function() {
        return this.getData();
    },

    findByField(field,data) {
        let users = this.findAll();
        let findUser = users.find(user => user[field] === data);
        return findUser

    },

    generateId: function(){
        let allUsers = this.findAll();
        let lastUser = allUsers.pop();
        if(lastUser)
            { return lastUser.id + 1 }
        else return 1
        
    },

    create: function(userData){
        let allUsers = this.findAll();
        let newUser = {
            id: this.generateId(),
            ...userData
        }
        allUsers.push(newUser);
        fs.writeFileSync(this.fileName, JSON.stringify(allUsers, null , ' '));
    }


    }




module.exports = user;

