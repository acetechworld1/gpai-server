import swaggerJsdoc from "swagger-jsdoc"
import swaggerUi from "swagger-ui-express"
import { Application } from 'express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'GPAI API',
      version: '1.0.0',
      description: 'Simple GPAI API',
    },
    servers: [
      {
        url: process.env.NODE_ENV === 'production' 
          ? process.env.RENDER_EXTERNAL_URL || 'https://gpai-server-e7ar.onrender.com'
          : 'http://localhost:3000',
        description: process.env.NODE_ENV === 'production' ? 'Production server' : 'Development server',
      },
    ],
  },
  apis: ['./src/routes/*.ts', './dist/routes/*.js'],
};

const specs = swaggerJsdoc(options);

export const setupSwagger = (app: Application): void => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, {
    swaggerOptions: {
      url: process.env.NODE_ENV === 'production' 
        ? `${process.env.RENDER_EXTERNAL_URL || 'https://gpai-server-e7ar.onrender.com'}/api-docs/swagger.json`
        : 'http://localhost:3000/api-docs/swagger.json'
    }
  }));
  
  // Serve swagger.json for clients that need it
  app.get('/api-docs/swagger.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(specs);
  });
};