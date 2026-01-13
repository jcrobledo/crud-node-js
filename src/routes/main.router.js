const express = require('express');
const router = express.Router();
const controller = require('../controllers/main.controller');

router.get("/", controller.index);
router.get("/indexLog", controller.indexLog);
router.get("/privada", controller.private);

module.exports = router;  //para poder exportar la ruta a otros códigos