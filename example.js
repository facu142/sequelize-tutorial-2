const Sequelize = require('sequelize');
const { DataTypes, Op } = Sequelize;

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

/*  FORMAS DE AUTENTICACION

    *Con promesas
    sequelize.authenticate().then(() => {
        console.log('connection successfull');
    }).catch((err) => console.log(err))

    *ASYNC / AWAIT
    async function myFunction() {
        await sequelize.authenticate();
        console.log('connection successfull');
    }
    myFunction();

*/


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
            len: [4, 6]
        }
    },
    password: {
        type: DataTypes.STRING,
    },
    age: {
        type: DataTypes.INTEGER,
        defaultValue: 21
    },
    wittCodeRocks: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
}, {
    freezeTableName: true,  // No pluraliza el nombre de la tabla
    timestamps: false,
    // tableName: 'my_custom_name',
    // paranoid: true // Añade columna delatedAt. Solo funciona si timestamps esta en true
});

// SYNC
User.sync({ alter: true }).then(() => {
    // Tabla actualizada

    /*  Usando build() y save() 
    const user = User.build({username: 'facu142', password : '123', age: 19, wittCodeRocks: true});
    // if (user.age > 75 ){
    //     user.old = true;
    // }
    return user.save();
    */


    // Usando create()
    // return User.create({
    //     username: 'facu1',
    // })

    // Agregando varias filas (cuidado que ignora las validaciones del modelo)
    // return User.bulkCreate([
    //     {
    //         username: 'facu1',
    //         age: 19,
    //         password: 'pizzasoccer'
    //     },
    //     {
    //         username: 'facu2',
    //         age: 20,
    //         password: 'pizzasoccer'
    //     },
    //     {
    //         username: 'facu3',
    //         age: 21,
    //         password: 'pizzasoccer'
    //     },
    //     {
    //         username: 'facu4',
    //         age: 22,
    //         password: 'pizzasoccer'
    //     },
    //     {
    //         username: 'facu5',
    //         age: 23,
    //         password: 'pizzasoccer'
    //     },

    // ], {validate: true} )




    // MODEL QUERIES

    // raw convierte como si usara toJSON()
    // return Student.findAll({ raw: true });


    // Devuelve los campos username y password
    // return User.findAll({attributes: ['username', 'password']});

    // Aplicando alias a los campos    
    // return User.findAll({
    //     attributes: [
    //         ['username', 'myName'], // myName como alias de username
    //         ['password', 'pwd']]
    // });


    // APLICAR ALGUNA FUNCION A LOS ATRIBUTOS (upper, sum, average, etc)
    // return User.findAll({
    //     attributes: [
    //         // Suma todo los valores de la columna age
    //         [sequelize.fn('SUM', sequelize.col('age')), 'howOld'],

    //         // Promedio de los valores de la columna age
    //         [sequelize.fn('AVG', sequelize.col('age')), 'average']
    //     ]
    // });

    // EXCLUIR ATRIBUTOS
    // return User.findAll({
    //     attributes: {
    //         exclude: ['password']
    //     }
    // });

    // WHERE Y ATTRIBUTES
    // return User.findAll({
    //     attributes: [
    //         'username', 
    //         'age'
    //     ],
    //     where: {
    //         age: 19,
    //         username: 'facu1'
    //     }
    // });

    // LIMIT
    // return User.findAll({
    //     limit: 2,
    // });

    // ORDER
    // return User.findAll({
    //     order: [
    //         ['age', 'DESC']
    //     ]
    // });

    // Grouping
    // return User.findAll({
    //     attributes: [
    //         'username',
    //         [sequelize.fn('SUM', sequelize.col('age')), 'sum_age']
    //     ],
    //     group: 'username'
    // });


    // SELECT FILAS CON OPERADORES

    //      OR
    // return User.findAll({
    //     where: {
    //         [Op.or]: { username: 'facu2', age: 20 }
    //     }
    // })

    //      AND
    // return User.findAll({
    //     where: {
    //         [Op.and]: { username: 'facu2', age: 20 }
    //     }
    // })

    // MAYOR
    // return User.findAll({
    //     where: {
    //         age : {
    //             [Op.gt]: 20
    //         }
    //     }
    // })

    // MENORES A 45 O NULLS
    // return User. findAll({
    //     where: {
    //         age : {
    //             [Op.or]: {
    //                 [Op.lt]: 45,
    //                 [Op.eq]: null,
    //             }
    //         }
    //     }
    // })

    // CON USERNAME CON LENGTH 5
    // return User.findAll({
    //     where: sequelize.where(sequelize.fn('char_length', sequelize.col('username')), 5)
    // })



    // UPDATES 

    // Actualizar usuario con age 22
    // return User.update({ username: 'pizza' }, {
    //     where: { age: 22 }
    // })

    // ACTUALIZAR A USUARIOS CON EDAD MAYOR A 1
    // return User.update({ username: 'YES!' }, {
    //     where: {
    //         age: {
    //             [Op.gt]: 1
    //         }
    //     }
    // })



    // DESTROY

    // return User.destroy({
    //     where: {
    //         username: 'YES!'
    //     }
    // })

    // MAXIMO DE EDAD
    // return User.max('age')

    // SUMA DE EDADES
    // return User.sum('age')
    
    return User.sum('age', { where: { age: 21 } });

}).then((data) => {

    /* FORMAS DE ACTUALIZAR LOS DATOS
 
    console.log('user added to database');
    data.username = 'pizza'
    data.age = 45
    // Restablecer la informacion original del usuario
    // return data.reload();
 
    // Forma de actualizar solo el campo age
    // return data.save({fields : ['age']}); 
 
    // Actualizar todos los campos
    return data.save(); 
    */

    // data.increment({ age: 10 })
    // data.decrement({ age: 2 });

    console.log(data);

    // Imprimiendo los multiples usuarios agregados con bulkCreate
    // data.forEach(user => {
    //     console.log(user.toJSON());
    // });

})
    // .then((data) => {
    //     console.log(data.toJSON());
    // })
    .catch((err) => {
        console.log(err);
    })


// console.log(sequelize.models.user);

/* OPCIONES DEL SYNC


* sync()
Crea la tabla si no existe

* sync( {force: true} )
Crea la tabla, si ya existe borra la anterior

* sync( {alter:true} )
Crea la tabla, si ya existe realiza los cambios necesarios para que la 
tabla coincida con el modelo

*/




