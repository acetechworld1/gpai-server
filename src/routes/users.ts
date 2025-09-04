import { Router } from 'express';
import { getAllUsers, createUser } from '../controllers/usersController';


const router = Router();


router.get('/', getAllUsers);
router.post('/', createUser);


export default router;