import express from "express";
import { join, login } from "../controller/usersController.js";
import { home } from "../controller/videoController.js";

const globalRouter = express.Router();

globalRouter.get('/', home);
globalRouter.get('/join', join);
globalRouter.get('/login', login);

export default globalRouter;