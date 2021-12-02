import express from "express";
import morgan from "morgan"; // 미들웨어

const PORT = 4000;

const app = express();
const logger = morgan('dev');
// GET /login 304 3.001 ms - -

const handleHome = (req, res) => {
    // return res.end();
    return res.send('<h1>HOME</h1>');
}
const handleLogin = (req, res) => {
    return res.send({id: 1, message: 'hello'});
}
const handlePrivate = (req, res) => {
    return res.send('<h1>Private</h1>');
}

app.use(logger); // get 메소드보다 가장 상위에 위치해 있기 때문에 항상 실행됨
app.get("/", handleHome);
app.get("/login", handleLogin);
app.get("/private", handlePrivate);

const handleListening = () => {
    return console.log(`Server listening on port http://localhost:${PORT}`);
}

app.listen(PORT, handleListening);