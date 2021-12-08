import express from "express";
import { githubLoginStart, githubLoginFinish, logout, getEdit, postEdit } from "../controller/usersController.js"
import { protectorMiddleware, publicOnlyMiddleware } from "../middlewares.js";

const usersRouter = express.Router();

usersRouter.get('/logout', protectorMiddleware, logout);
usersRouter.get('/github/start', publicOnlyMiddleware, githubLoginStart);
usersRouter.get('/github/finish', publicOnlyMiddleware, githubLoginFinish);
usersRouter.route('/edit').all(protectorMiddleware).get(getEdit).post(postEdit);

export default usersRouter;