const express = require('express');
const router = express.Router();
const controller = require('../controllers/main.controller');

router.get("/", controller.index);
router.get("/indexLog", controller.indexLog);

module.exports = router;  //para poder exportar la ruta a otros códigos