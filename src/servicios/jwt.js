'use strict'

var jwt = require('jwt-simple');
var moment = require('moment');
var shared_secret = 'proyecto_prueba_analista';

exports.createToken = function (usuario) {

    var payload = {
        sub: usuario._id,
        username: usuario.username,
        email: usuario.email,
        rol: usuario.rol,
        iat: moment().unix(),
        exp: moment().day(10, 'days').unix()
    }

    return jwt.encode(payload, shared_secret);
}