require("dotenv").config(); // requerimos el módulo para leer las variables de entorno

const express = require("express");
const app = express();
const path = require("path");
const layouts = require("express-ejs-layouts");
const methodOverride = require("method-override");
const PORT = process.env.PORT || 3001;

app.use(express.urlencoded({ extended: false })); // para poder leer datos de formularios
app.use(express.json()); // para poder leer datos en formato JSON
app.use(methodOverride('_method')); // para soportar métodos PUT y DELETE desde formularios HTML

app.use(express.static(path.join(__dirname, "public")));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "src/views"));

app.use(layouts);
app.set("layout", "./layouts/layout"); // especificamos la ubicación del layout principal

const mainRouter = require('./src/routes/main.router');
app.use(mainRouter);

app.use("/productos" ,require('./src/routes/productos.router'));  // Esta línea es un resumen de las dos anteriores
app.use("/contacto" ,require('./src/routes/contacto.router'));
app.use("/categorias" ,require('./src/routes/categorias.router'));

app.listen(PORT, () => console.log(`http://localhost:${PORT}`));
