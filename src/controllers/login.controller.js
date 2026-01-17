const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const model = require("../models/user");
const { validationResult } = require('express-validator');

const index = (req, res) => {

  let incorrecto = "";
  let error = "";
  let noExiste= "";

  if (req.query) {
    incorrecto = req.query.incorrecto;
    error = req.query.error;
    noExiste= req.query.noExiste;
    return res.render("login/login", { title: "Iniciar Sesión", incorrecto, error, noExiste });
  };

  res.render("login/login", { title: "Iniciar Sesión", incorrecto: "", error: "", noExiste: "" });
};

const auth = async (req, res) => {

  const result = validationResult(req);

  if (!result.error) {

    const usuarioAuth = {
      nombre: req.body.nombre,
      password: req.body.password,
    };

    try {

      const query = await model.findById(usuarioAuth.nombre);

      if (query) {
        const loginCorrecto = await bcrypt.compare(usuarioAuth.password, query.password);

        if (loginCorrecto) {

          const token = jwt.sign(
            { username: query.user, admin: true, createdAt: query.createdAt },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRATION }
          );

          const cookieOption = {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'development', // Solo HTTPS en === 'production'
            maxAge: 1000 * 60 * 60, // Tiempo de vida de la cookie (1 hora) 1ms *60*60
            path: "/",
          };

          res.cookie('authToken', token, cookieOption);
          return res.render('index', { title: "Login Correcto", layout: "./layouts/layout-private", username: query.user });

        } else {
          return res.redirect('/login?incorrecto=true&error=&noExiste=');
        };
      } else {
        return res.redirect('/login?incorrecto=&error=&noExiste=true');
      };

    } catch (error) {
      console.error("Error general de acceso:", error);
      return res.redirect('/login?incorrecto=&error=true&noExiste=');
    }
  } else {
    return res.redirect('/login?incorrecto=&error=true&noExiste=');
  };

};

const authCert = async (req, res) => {

  console.log("Reg.user desde authCert: ", req.user);

  const usuarioAuth = {
    dni: req.user.userCert.dni,
    nombre: req.user.userCert.nombreC,
    resultOCSP: req.user.userCert.resultOCSP
  };

  console.log("usuarioAuth desde authCert: ", usuarioAuth);

  if (usuarioAuth.resultOCSP.valido) {

    try {

      const query = await model.findByDni(usuarioAuth.dni);

      if (query) {

        const token = jwt.sign(
          { username: query.user, admin: true, createdAt: query.createdAt },
          process.env.JWT_SECRET,
          { expiresIn: process.env.JWT_EXPIRATION }
        );

        const cookieOption = {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'development', // Solo HTTPS en === 'production'
          maxAge: 1000 * 60 * 60, // Tiempo de vida de la cookie (1 hora) 1ms *60*60
          path: "/",
        };

        res.cookie('authToken', token, cookieOption);
        return res.render('index', { title: "Login Correcto", layout: "./layouts/layout-private", username: query.user, mensajeOCSP: usuarioAuth.resultOCSP.mensaje });

      } else {
        res.set('Connection', 'close');
        return res.redirect('/login?incorrecto=&error=&noExiste=true');
      };

    } catch (error) {
      console.error("Error general de acceso:", error);
      return res.redirect('/login?incorrecto=&error=true&noExiste=');
    };

  } else {
    console.error('Error al procesar el certificado (OCSP):', error);
    res.status(400).render('login/cert_Error', { title: "Error al procesar el certificado", layout: "./layouts/layout-public", mensajeOCSP: usuarioAuth.resultOCSP.mensaje });
  };

};

const logout = (req, res) => {

  const token = req.cookies.authToken;

  if (token) {
    res.clearCookie('authToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'development', // Solo HTTPS en === 'production'
      maxAge: 1000 * 60 * 60, // Tiempo de vida de la cookie (1 hora) 1ms *60*60
      path: "/",
    });
    delete req.session; // Destruye la sesión
    return res.render('login/logout', { title: "Logout Correcto", layout: "./layouts/layout-public" });
  } else {
    delete req.session; // Destruye la sesión
    return res.render('login/logout', { title: "Logout Correcto", layout: "./layouts/layout-public" });
  };

};

module.exports = {
  index,
  auth,
  logout,
  authCert
};