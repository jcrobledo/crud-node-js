const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');

const model = require("../models/user");

const index = (req, res) => { 

    let incorrecto = "";
    let error = "";

    if (req.query) {
      incorrecto = req.query.incorrecto;
      error = req.query.error;
      return res.render("login", { title: "Iniciar Sesión", incorrecto, error });
    };

    res.render("login", { title: "Iniciar Sesión", incorrecto: "", error: "" }); 
};

const auth = async (req, res) => {
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
          {expiresIn: process.env.JWT_EXPIRATION}
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
        return res.redirect('/login?incorrecto=true&error=');
      };      
    } else {
      return res.redirect('/login?incorrecto=true&error=');
    };
    
  } catch (error) {
    console.error("Error general de acceso:", error);   
    return res.redirect('/login?incorrecto=&error=true');
  }
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
    return res.render('logout', { title: "Login Correcto", layout: "./layouts/layout-public" });
  } else {
      res.render('logout', { title: "Login Correcto", layout: "./layouts/layout-public" });
  };
  
};

module.exports = {
  index,
  auth,
  logout
};