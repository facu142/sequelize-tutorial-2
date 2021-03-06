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
    // paranoid: true // A??ade columna delatedAt. Solo funciona si timestamps esta en true
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

// SYNC
User.sync({ alter: true }).then(() => {

    // Buscar por pk
    // return User.findByPk(82);

    //  USUARIOS CON EDAD MENOR A 10 O IGUAL A NULL
    // return User.findOne({
    //     where: {
    //         age: {
    //             [Op.or]: {
    //                 [Op.lt] : 10,
    //                 [Op.eq] : null
    //             }
    //         }
    //     }
    // });

    // FIND OR CREATE

    // return User.findOrCreate({
    //     where: {
    //         username: 'Tomm'
    //     },
    //     defaults: {
    //         age: 76
    //     }
    // })    

    // FIND AND COUNT ALL

    // return User.findAndCountAll({
    //     where: {
    //         username: 'facu2'
    //     }
    // })

    // PROBANDO VALIDADOR PERSONALIZADO DE EMAIL NULL
    // return User.create({
    //     username: 'asafsa',
    //     password: 'mypass',
    //     email: null,
    //     age: 2
    // })

    return User.create({
        username: 'facu',
        password: 'facu',
        email: 'facu@emmail.com',
        age: 2
    })

}).then((data) => {

    // FIND OR CREATE . Created devuelve true si creo una nueva fila y false si ya estaba creada
    // const [result , created] = data;
    // console.log(created);

    // FIND AND COUNT ALL
    // const { count, rows } = data;

    // console.log(count);
    // rows.forEach(element => {
    //     console.log(element.toJSON());
    // });


    // LOGS PARA EL FUNCIONAMIENTO DEL GETTER DE DESCRIPTION
    // console.log(data.user_id);
    // console.log(data.username);
    // console.log(data.description.toString());

    // VIRTUAL FIELD
    console.log(data.toJSON());



}).catch((err) => {
    console.log(err);
})










