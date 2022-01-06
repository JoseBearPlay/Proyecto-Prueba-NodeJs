'use strict'

var express = require("express");
var message_controlador = require("../controladores/message.controlador");

var md_authorization = require("../middlewares/authenticated");

var api = express.Router();
api.get('/ejemploMessage', message_controlador.ejemploMessages);
api.post('/clienteWeb', message_controlador.clienteWeb);
api.put('/credential', message_controlador.login);
api.post('/message', md_authorization.ensureAuth, message_controlador.postMessage);
api.get('/message/:id', md_authorization.ensureAuth, message_controlador.getMessageID);
api.get('/messages', md_authorization.ensureAuth, message_controlador.getMessages);

module.exports = api;