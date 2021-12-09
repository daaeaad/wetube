import express from "express";
import { githubLoginStart, githubLoginFinish, logout, getEdit, postEdit, getChagePassword, postChagePassword } from "../controller/usersController.js"
import { normalLoginOnlyMiddleware, protectorMiddleware, publicOnlyMiddleware, avatarFileMiddleware } from "../middlewares.js";


const usersRouter = express.Router();

usersRouter.get('/logout', protectorMiddleware, logout);

usersRouter.get('/github/start', publicOnlyMiddleware, githubLoginStart);

usersRouter.get('/github/finish', publicOnlyMiddleware, githubLoginFinish);

usersRouter
    .route('/edit')
    .all(protectorMiddleware)
    .get(getEdit)
    .post(avatarFileMiddleware.single('avatar'), postEdit);

usersRouter.route('/changepw')
    .all(protectorMiddleware, normalLoginOnlyMiddleware)
    .get(getChagePassword)
    .post(postChagePassword);


export default usersRouter;