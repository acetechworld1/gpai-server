import express, { Application, Request, Response } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import routes from './routes';
import { errorHandler } from './middleware/errorHandler';
import { setupSwagger } from './config/swagger';
// import users from './routes/users';


const app: Application = express();


app.use(helmet());
app.use(cors());
app.use(express.json());

// Trust proxy for Render
if (process.env.NODE_ENV === 'production') {
  app.set('trust proxy', 1);
}

// Setup Swagger
setupSwagger(app);

app.use('/api', routes);
// app.use("/api/user", users);

// Root endpoint
app.get('/', (req: Request, res: Response) => 
  res.json({ 
    success: true,
    message: 'GPAi API Server',
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString(),
    docs: `${req.protocol}://${req.get('host')}/api-docs`
  })
);

// Handle 404 routes
app.all('*', (req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
    timestamp: new Date().toISOString()
  });
});

app.use(errorHandler);

export default app;