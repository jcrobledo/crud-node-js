const express = require("express");
const router = express.Router();
const controller = require('../controllers/login.controller');

router.get("/", controller.index);
router.post("/", controller.auth);
router.get("/logout", controller.logout);

module.exports = router;  //para poder exportar la ruta a otros códigos