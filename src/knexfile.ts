import * as dotenv from 'dotenv';

//For env File
dotenv.config();


const knexConfig = {
  development: {
    client: 'mysql2',
    connection: {
      host: process.env.DATABASE_HOST,
      user: process.env.DATABASE_USERNAME,
      port: 3306,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
    },
    migrations: {
      directory: './db/migrations',
    },
  },
};

export default knexConfig;
