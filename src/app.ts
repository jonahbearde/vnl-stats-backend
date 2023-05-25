import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import dotenv from 'dotenv';
import cors from 'cors';
import * as middlewares from './middlewares';
import api from './api';
import MessageResponse from './interfaces/MessageResponse';

dotenv.config();

const app = express();

app.use(morgan('common'));
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(middlewares.deserializeUser);

app.get<{}, MessageResponse>('/', (req, res) => {
	res.json({
		message: '🦄🌈✨👋🌎🌍🌏✨🌈🦄',
	});
});

app.use('/api/v1', api);

app.use(middlewares.notFound);
app.use(middlewares.errorHandler);



export default app;
