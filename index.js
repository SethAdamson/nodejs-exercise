require('dotenv').config();
const express = require('express');
const ctrl = require('./controllers');
const app = express();

//----------------DotEnv--------------------//

const {
    SERVER_PORT,
} = process.env;

//-----------------------------------------------------------//

app.get('/people', ctrl.getPeople);
app.get('/planets', ctrl.getPlanets);


app.listen(SERVER_PORT, () => {
    console.log(`Listening on port: ${SERVER_PORT}`)
});