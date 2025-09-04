import express, { Application, Request, Response } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import routes from './routes';


const app: Application = express();


app.use(helmet());
app.use(cors());
app.use(express.json());


app.use('/api', routes);


app.get('/', (req: Request, res: Response) => res.json({ status: 'ok' }));


export default app;