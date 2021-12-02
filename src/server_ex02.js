import express from "express";
import morgan from "morgan";

const PORT = 4000;

const app = express();
const logger = morgan('dev');
app.use(logger); 

const globalRouter = express.Router(); // 1. Router 변수 선언 - express의 Router 사용하는 변수 선언
app.use('/', globalRouter); //2. Router 변수에 Request url을 지정 - url이 '/'로 시작되면 globalRouter를 사용하도록 

const usersRouter = express.Router();
app.use('/users', usersRouter);

const videoRouter = express.Router();
app.use('/video', videoRouter);

const handleHome = (req, res) => { res.send('Home') };
const handleUsersEdit = (req, res) => { res.send('Users Edit') };
const handleVideoWatch = (req, res) => { res.send('Video Watch') };

globalRouter.get('/main', handleHome); // 3. Request url이 지정된 Router 변수를 실행 - ('/'로 시작되고 그 다음에 '/main' 리퀘스트가 붙으면 handleHome 함수를 실행하라는 내용)
usersRouter.get('/edit', handleUsersEdit);
videoRouter.get('/watch', handleVideoWatch);

const handleListening = () => {
    return console.log(`Server listening on port http://localhost:${PORT}`);
}

app.listen(PORT, handleListening);