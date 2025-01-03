const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
    process.env.DATABASE_URL || {
        database: process.env.DB_NAME,
        username: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        host: process.env.DB_HOST,
        port: process.env.DB_PORT || 5432,
        dialect: 'postgres',
        dialectOptions: process.env.NODE_ENV === 'production' ? {
            ssl: {
                require: true,
                rejectUnauthorized: false,
            },
        } : {},
    }
);

sequelize.authenticate()
    .then(() => console.log('Database connected successfully!'))
    .catch((err) => console.error('Database connection failed:', err));

module.exports = sequelize;
