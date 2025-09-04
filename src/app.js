const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const routes = require('./routes');

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

app.use('/api', routes);

app.get('/', (req, res) => res.json({ status: 'ok' }));

module.exports = app;