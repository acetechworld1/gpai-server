require('dotenv').config();
const http = require('http');
const app = require('./src/app');
require('./src/db'); // connect to Mongo

const PORT = process.env.PORT || 3000;
const server = http.createServer(app);

server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
