import express from "express";
import morgan from "morgan";
import rootRouter from "./router/rootRouter.js";
import usersRouter from "./router/usersRouter.js";
import videoRouter from "./router/videosRouter.js";

const app = express();
const logger = morgan('dev');
app.use(logger); 

// 뷰엔진 설정 : 퍼그
app.set('views', process.cwd() + '/src/views');
app.set('view engine', 'pug');

app.use(express.urlencoded({extended:true}));
app.use('/', rootRouter);
app.use('/users', usersRouter);
app.use('/video', videoRouter);


export default app;