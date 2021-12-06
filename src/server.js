import express from "express";
import morgan from "morgan";
import session from "express-session";
import Mongostore from "connect-mongo";
import rootRouter from "./router/rootRouter.js";
import usersRouter from "./router/usersRouter.js";
import videoRouter from "./router/videosRouter.js";
import { localsMiddleware } from "./middlewares.js";

const app = express();
const logger = morgan('dev');
app.use(logger); 

// 뷰엔진 설정 : 퍼그
app.set('views', process.cwd() + '/src/views');
app.set('view engine', 'pug');

app.use(express.urlencoded({extended:true}));

app.use(
    session({
        secret: process.env.COOKIE_SECRET,
        resave: false,
        saveUninitialized: false,  // 불필요한 세션이 저장되지 않도록 false로 설정
        cookie: {
            maxAge: 86400000 // 세션 유효기간: 24시간으로 설정
        },
        store: Mongostore.create({ mongoUrl: process.env.DB_URL })    
    })
);
app.use(localsMiddleware);

app.use('/', rootRouter);
app.use('/users', usersRouter);
app.use('/video', videoRouter);


export default app;