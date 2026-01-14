const bcrypt = require("bcrypt");
const model = require("../models/user");
const { validationResult } = require('express-validator');


const index = (req, res) => {

  let enviado = "";
  let visible = "";
  let existeUsu = "";
  let error = "";


  if (req.query) {
    enviado = req.query.enviado;
    visible = req.query.visible;
    existeUsu = req.query.existeUsu;
    error = req.query.error;
    return res.render("registro", { title: "Registro de Usuario", enviado, visible, existeUsu, error });
  }

  res.render("registro", { title: "Registro de Usuario", enviado: "", visible: "", existeUsu: "", error: "" });

};

const store = async (req, res) => {

  const result = validationResult(req);

  if (!result.error) {

    const nuevoUsuario = {
      nombre: req.body.nombre,
      password: req.body.password,
      createdAt: new Date(),
      updateAt: new Date(),
    };

    try {

      const query = await model.findById(nuevoUsuario.nombre);

      if (!query) {
        nuevoUsuario.password = await bcrypt.hash(nuevoUsuario.password, 10);
        const result = await model.store(nuevoUsuario);
        return res.redirect('/registro?enviado=true&visible=true&existeUsu=false&error=');
      } else {
        return res.redirect('/registro?enviado=false&visible=true&existeUsu=true&error=');
      };

    } catch (error) {
      console.error("Error al crear el usuario:", error);
      return res.status(500).redirect('/registro?enviado=false&visible=true&existeUsu=false&error=true');
    }

  } else {
      return res.status(500).redirect('/registro?enviado=false&visible=true&existeUsu=false&error=true');
  };

};

module.exports = {
  index,
  store
};