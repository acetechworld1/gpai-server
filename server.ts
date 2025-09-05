import dotenv from 'dotenv';
import http from 'http';
import app from './src/app';
import './src/db'; // connect to Mongo


dotenv.config();


const PORT = process.env.PORT || 3000;
const server = http.createServer(app);


server.listen(PORT, () => {
    console.log(`🚀 Server listening on port ${PORT}`);
    console.log(`📖 API Documentation: http://localhost:${PORT}/api-docs`);
});