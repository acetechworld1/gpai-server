const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController');

import { Request, Response } from 'express';

router.get('/', (req: Request, res: Response) => {
    res.send('Welcome to gpai')
});


module.exports = router;