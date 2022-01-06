'use strict'

var Usuario = require("../modelos/usuario.modelo");
var Message = require("../modelos/message.modelo");
var bcrypt = require('bcrypt-nodejs');
var jwt = require("../servicios/jwt");

function ejemploMessages(req, res){
    return res.status(200).send({mensaje: 'Ejemplo de Message'});
}

function clienteWeb(req, res){

    var usuarioModel = new Usuario();
    var params = req.body;
    console.log(params);
    if(params.email && params.username && params.password){
        usuarioModel.username = params.username;
        usuarioModel.email = params.email;
        usuarioModel.password = params.password;
        usuarioModel.rol = 'User';

        Usuario.find({
            $or: [
                { username: usuarioModel.username},
                { email: usuarioModel.email},
                { password: usuarioModel.password}
            ]
        }).exec((err, clienteEncontrado)=>{
            if(err) return res.status(403).send({ mensaje: 'Error en la peticion de crear el cliente web'});

            if(clienteEncontrado && clienteEncontrado.length >= 1){
                return res.status(403).send({ mensaje: 'El cliente que desea crear ya se encuentra dentro del servidor web'});
            } else{
                bcrypt.hash(params.password, null, null, (err, passwordEncriptada)=>{
                    usuarioModel.password = passwordEncriptada;

                    usuarioModel.save((err, clienteGuardado)=>{
                        if(err) return res.status(403).send({ mensaje: 'Error en la peticion'});

                        if(clienteGuardado) {
                            res.status(200).send({ clienteGuardado })
                        } else {
                            res.status(403).send({ mensaje: 'No se ha podido registrar los datos del cliente'});
                        }
                    })
                })
            }
        })

    }
}

function login(req, res){
    var params = req.body;

   Usuario.findOne({ email: params.email }, (err, credencialesEncontradas) => {
       if(err) return res.status(403).send({ mensaje: 'Error en la peticion'});

       if (credencialesEncontradas) {
           bcrypt.compare(params.password, credencialesEncontradas.password, (err, passVerificada) => {
               if(passVerificada) {
                   if(params.getToken === 'true') {
                       return res.status(200).send({
                           token: jwt.createToken(credencialesEncontradas)
                       })
                   } else{
                       credencialesEncontradas.password = undefined;
                       return res.status(200).send({ credencialesEncontradas });
                   }
               } else{
                   return res.status(403).send({ mensaje: 'Los datos no se han podido corroborar correctamente'});
               }
           })
       } else{
           return res.status(403).send({ mensaje: 'Error al buscar el usuario'});
       }
   }) 
}


function postMessage(req, res) {

    var messageModel = new Message();
    var params = req.body;
    console.log(params);

    if(req.user.rol != 'User'){
        return res.status(403).send({ mensaje: 'No posee los permisos para acceder a la ruta requerida'});
    }

    if(params.messages && params.tags){
        messageModel.messages = params.messages;
        messageModel.tags = params.tags;
    }

    Message.find({ 
        $or: [
            { messages: messageModel.messages},
            { tags: messageModel.tags}
        ]
    }).exec((err, messageEncontrado)=>{
        if(err) return res.status(403).send({ mensaje: 'Error en la peticion del mensaje'});

        if(messageEncontrado && messageEncontrado.length >= 1){
            return res.status(403).send({ mensaje: 'Los datos ya se encuentran almacenados en el servidor'});
        } else{

            messageModel.save((err, messageGuardado)=>{
                if(err) return res.status(403).send({ mensaje: 'Error en la peticion'});

                if(messageGuardado){
                    res.status(200).send({ messageGuardado })
                } else{
                    res.status(403).send({ mensaje: 'No se han podido almacenar los datos'});
                }
            })
        }
    })
}

function getMessageID(req, res){

    var messageId = req.params.id;

    if(req.user.rol != 'User'){
        return res.status(403).send({ mensaje: 'No posee los permisos requeridos para ingresar a la ruta requerida'});
    }

    Message.findById(messageId, (err, messageEncontrado)=>{
        if(err) return res.status(403).send({ mensaje: 'Error en la peticion'});
        if(!messageEncontrado) return res.status(403).send({ mensaje: 'No se pudo obtener el mensaje'});

        return res.status(200).send({ messageEncontrado });
    })
}

function getMessages(req, res){
    
    if(req.user.rol != 'User'){
        return res.status(403).send({ mensaje: 'No posee los permisos requeridos para ingresar a la ruta requerida'});
    }

    Message.find().exec((err, messages)=>{
        if(err) return res.status(403).send({ mensaje: 'Error en la peticion'});
        if(!messages) return res.status(403).send({ mensaje: 'No se pudo obtener los mensajes del servidor Web'});

        return res.status(200).send({messages});
    })
}


module.exports = {
    ejemploMessages,
    clienteWeb,
    login,
    postMessage,
    getMessageID,
    getMessages
}