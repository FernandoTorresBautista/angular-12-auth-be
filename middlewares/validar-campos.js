const { response } = require("express");
const { validationResult } = require("express-validator");

// la unica diferencia con un controlador, es que en un 
// middleware existe el next para seguir con la siguiente funcion
const validarCampos = (req, res = response, next) => {

  const errors = validationResult( req );
  //console.log(errors);
  if ( !errors.isEmpty() ) {
    return res.status(400).json({
      ok: false,
      errors: errors.mapped()
    });
  }

  next();
}

module.exports = {
  validarCampos
}