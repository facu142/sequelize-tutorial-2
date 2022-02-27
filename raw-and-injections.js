const Sequelize = require('sequelize');
const { DataTypes, Op } = Sequelize;
const bcrypt = require('bcrypt');
const zlib = require('zlib');
const { get } = require('express/lib/response');

const sequelize = new Sequelize('sequelize-video', 'root', 'root', {
    dialect: 'mysql',
    // define: {
    //     freezeTableName: true,
    // },
    host: 'localhost',
    port: 3306
});

// Drop tablas usando regEx
sequelize.drop({ match: /_test$/ });


// definicion de model user
const User = sequelize.define('user', {
    user_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            len: [4, 10]
        },

        // GETTER
        get() {
            // No usar aca this.username porque llama a este getter y se produce un bucle infinito
            const rawValue = this.getDataValue('username');
            return rawValue.toUpperCase();
        }
    },
    password: {
        type: DataTypes.STRING,
        // SETTER 
        set(value) {
            const salt = bcrypt.genSaltSync(12);
            const hash = bcrypt.hashSync(value, salt);
            this.setDataValue('password', hash);
        }
    },
    age: {
        type: DataTypes.INTEGER,
        defaultValue: 21,
        validate: {
            // isOldEnough(value) {
            //     if (value < 21){
            //         throw new Error('Too young!');
            //     }
            // }
            isNumeric: {
                msg: 'You must enter a number for age!'
            }
        }
    },
    wittCodeRocks: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
    description: {
        type: DataTypes.STRING,
        // set(value) {
        //     // Comprimir data
        //     const compressed = zlib.deflateSync(value).toString('base64');
        //     this.setDataValue('description', compressed);
        // },
        // get() {
        //     // Descomprimir data
        //     const value = this.getDataValue('description');
        //     const uncompressed = zlib.inflateSync(Buffer.from(value, 'base64'));
        //     return uncompressed;
        // }
    },
    aboutUser: {
        // VIRTUAL FIELDS
        type: DataTypes.VIRTUAL,
        get() {
            return `${this.username} ${this.description}`;
        }
    },
    email: {
        type: DataTypes.STRING,
        // unique: true,
        allowNull: true,
        validate: {
            // isEmail: true,
            // isIn: {
            //     args: [ 'me@soccer.org', 'me@soccer.com'],
            //     msg: 'The provided email must be one of the following...'
            // }
            myEmailValidator(value) {
                if (value == null) {
                    throw new Error('please enter an email')
                }
            }

        }

    }
}, {
    freezeTableName: true,  // No pluraliza el nombre de la tabla
    timestamps: false,
    // tableName: 'my_custom_name',
    // paranoid: true // Añade columna delatedAt. Solo funciona si timestamps esta en true
    validate: {
        // Custom validator 
        usernamePassMatch() {
            if (this.username == this.password) {
                throw new Error('Password cannot be your username')
            } else {
                console.log('soccer!');
            }
        }
    }
});

function myFunction() {
    console.log('\nRUNNING SQL STATEMENT!\n');
}

// SYNC
User.sync({ alter: true }).then(() => {

    // return sequelize.query(`UPDATE user SET age = 100 WHERE username ='Tomm'`, { type: Sequelize.QueryTypes.UPDATE });
    // return sequelize.query(`SELECT * from user`, { type: Sequelize.QueryTypes.SELECT });
    // return sequelize.query(`SELECT * FROM user LIMIT 2`, { model: User, plain: true })
    // return sequelize.query(`SELECT * FROM user LIMIT 2`, { logging: myFunction });

    // EVITAR SQL INJECTIONS 

    const username = 'facu1';
    const password = 'asdfg';


    // NO USAR
    // return sequelize.query(`SELECT username FROM user WHERE username = ${username} AND password = ${password}`);

    // SI USAR REMPLACEMENTS
    // return sequelize.query(`SELECT * FROM user WHERE username = :username AND password = :password`, {
    //     replacements: { username: 'facu1', password: 'asdfg' },
    //     plain: true
    // });


    // USERNAME IN
    // return sequelize.query(`SELECT * FROM user WHERE username IN (:username)`, {
    //     replacements: { username: ['facuh', 'Tomm'] },
    //     // plain: true              // Sin el pain
    // });

    // USERNAME LIKE
    // return sequelize.query(`SELECT * FROM user WHERE username LIKE :username`, {
    //     replacements : { username: '%fa%' },
    //     // plain: true              // Sin el pain
    // });


    // BIND PARAMETERS COMO ARRAY
    // return sequelize.query(`SELECT * FROM user WHERE username = $1 AND password = $2`, {
    //     bind: ['facu1', 'asdfg']
    // });

    // BIND PARAMETERS COMO OBJETO
    // return sequelize.query(`SELECT * FROM user WHERE username = $username AND password = $password`, {
    //     bind: { username: 'facu1', password: 'asdfg' }
    // });



}).then((data) => {



    const [result, metadata] = data;

    // console.log(result);
    // console.log('metadata   ',metadata);

    console.log(result);

}).catch((err) => {
    console.log(err);
})










