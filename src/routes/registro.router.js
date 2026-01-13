const express = require("express");
const router = express.Router();
const controller = require('../controllers/registro.controller');

router.get("/", controller.index);
router.post("/", controller.store);

module.exports = router;  //para poder exportar la ruta a otros códigos