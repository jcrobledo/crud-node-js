require("dotenv").config(); // requerimos el módulo para leer las variables de entorno

const express = require("express");
const app = express();
const path = require("path");
const layouts = require("express-ejs-layouts");
const methodOverride = require("method-override");
const cookieParser = require('cookie-parser');
const cors = require('cors');
// const jwt = require('express-jwt');
const PORT = process.env.PORT || 3001;

// app.use(
//   jwt(
//   { 
//     secret: process.env.JWT_SECRET, 
//     algorithms: ['HS256'],
//     getToken: req => req.cookies.token
//   }));

app.use(cors()); // para habilitar el Intercambio de Recursos de Origen Cruzado
app.use(cookieParser()); // para poder manejar cookies
app.use(express.urlencoded({ extended: false })); // para poder leer datos de formularios
app.use(express.json()); // para poder leer datos en formato JSON
app.use(methodOverride('_method')); // para soportar métodos PUT y DELETE desde formularios HTML

app.use(express.static(path.join(__dirname, "public")));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "src/views"));

app.use(layouts);
app.set("layout", "./layouts/layout-public"); // especificamos la ubicación del layout principal

const vToken = require("./src/middlewares/verify-token");

const mainRouter = require('./src/routes/main.router');
app.use(mainRouter);

app.use("/productos",vToken.verifyToken, require('./src/routes/productos.router'));  // Esta línea es un resumen de las dos anteriores
app.use("/contacto" ,require('./src/routes/contacto.router'));
app.use("/categorias", vToken.verifyToken, require('./src/routes/categorias.router'));
app.use("/login", require('./src/routes/login.router'));
app.use("/registro", require('./src/routes/registro.router'));


app.listen(PORT, () => console.log(`http://localhost:${PORT}`));
