const express = require("express");
const router = express.Router();
const controller = require('../controllers/login.controller');

router.get("/", controller.authCert);

module.exports = router;  // para poder exportar la ruta a otros códigos