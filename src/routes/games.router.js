import { Router } from 'express';

export const games = Router();
games.get('/games');
games.post('/games');