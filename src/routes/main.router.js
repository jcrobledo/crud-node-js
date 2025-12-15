const express = require('express');
const router = express.Router();

router.get("/", (req, res) => {
    res.send("Hola Mundo!!!");
});

module.exports = router;  //para poder exportar la ruta a otros códigos