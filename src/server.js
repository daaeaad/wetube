import express from "express";

const app = express();

const PORT = 4000;

const handleHome = () => {
    return console.log('somebody wants to go home');
}
app.get("/", handleHome);

const handleListening = () => {
    return console.log(`Server listening on port http://localhost:${PORT}`);
}

app.listen(PORT, handleListening);