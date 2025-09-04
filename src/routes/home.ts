const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController');

router.get('/', (req,res)=>{
    res.send('Welcome to gpai')
});


module.exports = router;