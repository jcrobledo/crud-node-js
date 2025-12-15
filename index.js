require("dotenv").config(); // requerimos el módulo para leer las variables de entorno

const express = require("express");
const app = express();
const PORT = process.env.PORT || 3001;

const mainRouter = require('./src/routes/main.router');
app.use(mainRouter);

app.use("/productos" ,require('./src/routes/productos.router'))  // Esta línea es un resumen de las dos anteriores

app.listen(PORT, () => console.log(`http://localhost:${PORT}`));
