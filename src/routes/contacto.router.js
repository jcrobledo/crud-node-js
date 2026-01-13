const express = require('express');
const router = express.Router();
const controller = require('../controllers/contacto.controller');

router.get("/", controller.index);
router.get("/contactoLog", controller.indexLog);
router.post("/", controller.submit);

module.exports = router;  //para poder exportar la ruta a otros códigos