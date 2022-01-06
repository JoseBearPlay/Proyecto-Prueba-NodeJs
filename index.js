
const app = require("./app");
const mongoose = require("mongoose");

mongoose.Promise = global.Promise
mongoose.connect('mongodb://localhost:27017/DBProyecto', { useNewUrlParser:true, useUnifiedTopology: true}).then(()=>{
    console.log('Se encuentra conectado a la base de datos');

    app.listen(3000, function () {
        console.log("Servidor corriendo correctamente en el puerto 3000");
    })
}).catch(err => console.log(err))