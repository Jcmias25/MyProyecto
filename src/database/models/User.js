module.exports = (sequelize, dataTypes) => {

    let alias = 'User';
    let cols = {
        name: {
            type: dataTypes.STRING
        },
        password: {
            type: dataTypes.STRING
        },
        lastname: {
            type: dataTypes.STRING
        },
        age: {
            type: dataTypes.INTEGER
        },
        email: {
            type: dataTypes.STRING
        },
        id_profession: {
            type: dataTypes.INTEGER
        },
        image: {
            type: dataTypes.STRING,

        },
        id_user: {
            type: dataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        }
    };

    let config = {

        tableName: 'users',
        timestamps: false,
        underscore: true
    }

    const User = sequelize.define(alias,cols,config);
    return User;


}