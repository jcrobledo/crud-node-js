require('dotenv').config(); // requerimos el módulo para leer las variables de entorno

const express = require("express");
const app = express();
const PORT = process.env.PORT || 3001;

app.get("/", (req, res) => {
    res.send("Hola Mundo!!!");
});

app.listen(PORT, () => console.log(`http://localhost:${PORT}`));