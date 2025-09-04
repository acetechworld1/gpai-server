import { Router } from 'express';
import usersRouter from './users';


const router = Router();


router.use('/users', usersRouter);
router.use('/home', (req, res) => {
    res.send('Welcome to gpai');
});


export default router;