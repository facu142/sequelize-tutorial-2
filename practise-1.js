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


// definicion de model user
const Student = sequelize.define('student', {
    student_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            len: [4, 20]
        }
    },
    favourite_class: {
        type: DataTypes.STRING(25),
        defaultValue: 'Computer Science'
    },
    school_year: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    subscribed_to_wittcode: {
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
Student.sync({ alter: true }).then(() => {

    // return Student.bulkCreate([
    //     {
    //         name: 'facu',
    //         favourite_class: 'ASI',
    //         school_year: 1,
    //         subscribed_to_wittcode: false
    //     },
    //     {
    //         name: 'facu2',
    //         favourite_class: 'AED',
    //         school_year: 2,
    //         subscribed_to_wittcode: true
    //     },
    //     {
    //         name: 'facu3',
    //         favourite_class: 'PPR',
    //         school_year: 3,
    //         subscribed_to_wittcode: true
    //     },
    //     {
    //         name: 'facu4',
    //         favourite_class: 'IT class',
    //         school_year: 4,
    //         subscribed_to_wittcode: false
    //     },
    // ], { validate: true })

    // return Student.findAll({
    //     // where: {
    //     //     [Op.or] : { favourite_class: 'Computer Science', subscribed_to_wittcode: true }
    //     // },
    //     atrributes: [
    //         [sequelize.fn('COUNT', sequelize.col('school_year')), 'num_students']
    //     ]
    // });

    return Student.findAll({
        // where: {
        //     [Op.or]: { favourite_class: 'Computer Science', subscribed_to_wittcode: true }
        // },

        // CUENTA LA CANTIDAD DE ESTUDIANTES POR CURSO
        attributes: [
            'school_year',
            [sequelize.fn(' COUNT', sequelize.col('school_year')), 'num_students']
        ],
        group: 'school_year'
    });



}).then((data) => {

    data.forEach(student => {
        console.log(student.toJSON());
    });


}).catch((err) => {
    console.log(err);
})





