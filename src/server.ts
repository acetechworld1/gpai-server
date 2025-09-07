import dotenv from 'dotenv';
import http from 'http';
import app from './app';
import './db'; // connect to Mongo


dotenv.config();


const PORT = process.env.PORT || 3000;
const server = http.createServer(app);


server.listen(PORT, () => {
  console.log(`🚀 Server listening on port ${PORT}`);
  console.log(`📝 API Documentation: ${process.env.NODE_ENV === 'production' ? process.env.RENDER_EXTERNAL_URL : `http://localhost:${PORT}`}/api-docs`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('Process terminated');
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  server.close(() => {
    console.log('Process terminated');
  });
});