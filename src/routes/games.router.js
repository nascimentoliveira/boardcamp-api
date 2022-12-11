import { Router } from 'express';

import { gameSchemaValidation } from '../middlewares/games/gameSchemaValidation.middleware.js';
import { gameCategoryValidation } from '../middlewares/games/gameCategoryValidation.middleware.js';
import { gameNameValidation } from '../middlewares/games/gameNameValidation.middleware.js';
import { listGames, insertGame } from '../controllers/games.controller.js';

export const games = Router();
games.get('/games', listGames);
games.post('/games', gameSchemaValidation, gameCategoryValidation, gameNameValidation, insertGame);