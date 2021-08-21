const { response } = require('express');
const Usuario = require('../models/Usuario');
const bcrypt = require('bcryptjs');
const { generarJWT } = require('../helpers/jwt');

const crearUsuario = async(req, res = response) => {

  const {email, name, password} = req.body;
  //console.log( email, name, password );

  // verificar el email
  try {
    
    const usuario = await Usuario.findOne({email}); //({email:email});
    if (usuario) {
      return res.status(400).json({
        ok:false,
        msg:'El usuario ya existe con ese mail'
      });
    }

    // Crear usuario con el usuario
    const dbUser = new Usuario(req.body);

    // Hash contraseña
    const salt = bcrypt.genSaltSync(); // (10);
    dbUser.password = bcrypt.hashSync( password, salt );
    
    // Generar JWT 
    const token = await generarJWT(dbUser.id, name);

    // Crear usuario de DB 
    await dbUser.save();
  
    // Generar respuesta
    return res.status(201).json({
      ok: true,
      uid: dbUser.id,
      name,
      email,
      token
    });

  } catch {
    return res.status(500).json({
      ok: false,
      msg: 'Algo salio mal, hable con el administrador'
    });
  }

}

const loginUsuario = async (req, res = response) => {

  const {email, password} = req.body;
  //console.log( email, password );

  try {

    const dbUser = await Usuario.findOne({email}); //({email:email});
    if ( !dbUser ) {
      return res.status(500).json({
        ok:false,
        msg: 'Email / Password: usuario incorrecto'
      });
    }
    
    const validPassword = bcrypt.compareSync( password, dbUser.password );

    if ( !validPassword ) {
      return res.status(500).json({
        ok:false,
        msg: 'Email / Password: usuario incorrecto'
      });
    }

    const token = await generarJWT(dbUser.id, dbUser.name);

    return res.json({
      ok:true,
      uid: dbUser.id, 
      name: dbUser.name, 
      email,
      token
    });

  } catch(error) {
    console.log(error);

    return res.status(500).json({
      ok:false,
      msg: 'Hable con el administrador'
    });
  }

}

const revalidarToken = async(req, res = response) => {

  // const token = req.header('x-api-key');

  // if ( !token ) {
  //   return res.status(401).json({
  //     ok:false,
  //     msg:'Error authentication'
  //   });
  // }

  // the middleware put the ouid, name
  const {uid} = req;

  const dbUser = await Usuario.findById(uid); 
  if ( !dbUser ) {
    return res.status(500).json({
      ok:false,
      msg: 'Usuario no encontrado en DB'
    });
  }

  // 
  const token = await generarJWT(uid, dbUser.name);

  return res.json({
    ok: true,
    uid, 
    name:dbUser.name,
    email:dbUser.email,
    token
  })
}

module.exports = {
  crearUsuario,
  loginUsuario,
  revalidarToken
}