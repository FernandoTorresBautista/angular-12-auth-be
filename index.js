const express = require('express');
const cors = require('cors');
const { dbConnection } = require('./db/config');
require('dotenv').config(); // tomar la configuracion del archivo .env
//console.log( process.env );

// Crear servidor/app express
const app = express();

// Base de datos
dbConnection();

// Directorio publico
app.use( express.static('public') );

// CORS
app.use(cors());

// Lectura y parseo del body
app.use( express.json() );

// GET ping
app.get('/ping', (req, res)=>{
  res.status(200).json({
    ok: true,
    msg: 'pong'
  });
});

// middleware router
app.use('/api/auth/', require('./routes/auth'));

// 
app.listen( process.env.PORT, () => {
  console.log(`Servidor corriendo en puerto ${ process.env.PORT }`);
});
