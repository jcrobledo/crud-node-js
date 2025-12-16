require("dotenv").config(); // requerimos el módulo para leer las variables de entorno

const express = require("express");
const app = express();
const PORT = process.env.PORT || 3001;

const path = require("path");

app.use(express.static(path.join(__dirname, "public")));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "src/views"));

const mainRouter = require('./src/routes/main.router');
app.use(mainRouter);

app.use("/productos" ,require('./src/routes/productos.router'))  // Esta línea es un resumen de las dos anteriores

app.listen(PORT, () => console.log(`http://localhost:${PORT}`));
