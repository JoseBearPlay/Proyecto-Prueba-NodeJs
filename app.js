'use strict'

const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");

var message_rutas = require("./src/rutas/message.rutas");

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use(cors());

app.use('/api', message_rutas);

module.exports = app;