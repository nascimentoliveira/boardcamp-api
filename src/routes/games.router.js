import { Router } from 'express';

import { gameSchemaValidation } from '../middlewares/games/gameSchemaValidation.middleware.js';
import { gameValidation } from '../middlewares/games/gameValidation.middleware.js';
import { listGames, insertGame } from '../controllers/games.controller.js';

export const games = Router();
games.get('/games', listGames);
games.post('/games', gameSchemaValidation, gameValidation, insertGame);