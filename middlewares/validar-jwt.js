const { response } = require('express')
const jwt = require('jsonwebtoken');

const validarJWT = (req, res = response, next) => {

  const token = req.header('x-api-key');

  if ( !token ) {
    return res.status(401).json({
      ok:false,
      msg:'Error authentication'
    });
  }

  try {

    //
    const {uid, name} = jwt.verify(token, process.env.SECRET_JWT_SEED);
    //console.log(uid, name);

    req.uid = uid;
    req.name = name;
    
  } catch(error) {
    return res.status( 401 ).json({
      ok:false,
      msg:'Error authentication'
    });
  }

  next();
}

module.exports = {
  validarJWT
}