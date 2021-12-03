import express from "express";
import { getJoin, postJoin, login } from "../controller/usersController.js";
import { home, search } from "../controller/videoController.js";

const rootRouter = express.Router();

rootRouter.get('/', home);
rootRouter.route('/join').get(getJoin).post(postJoin);
rootRouter.get('/login', login);
rootRouter.get('/search', search);

export default rootRouter;