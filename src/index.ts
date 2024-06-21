import express, { Application } from 'express';
import * as dotenv from 'dotenv';
import 'reflect-metadata';
import { createExpressServer } from 'routing-controllers';
import { AuthController } from './controller/AuthController'; // Ensure this path is correct

dotenv.config();

const app: Application = express();
const port = process.env.PORT || 5000;

app.use(express.json());

// Database connection logic here
// connectToDatabase();

// Create express server and register controllers
const routingControllersApp = createExpressServer({
  routePrefix: '/api',
  controllers: [AuthController], // Register your controllers
});

// Start the server
routingControllersApp.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
