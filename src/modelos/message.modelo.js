'use strict'

var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var MessageSchema = Schema({
     
    messages: String,
    tags: String
});

module.exports = mongoose.model('messages', MessageSchema);
