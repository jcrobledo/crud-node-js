const express = require("express");
const router = express.Router();
const controller = require('../controllers/qr-url-din.controller');

const changePortX509 = require("../middlewares/change-port-X509");
const vTokenCert = require("../middlewares/verify-cert");

const { body } = require('express-validator');

const rules = [
  body('nombre')
    .trim()
    .escape()
    .notEmpty()
    .isLength({min:8})
    .matches('(?=.*[a-zA-Z])(?=.*[0-9])[a-zA-Z0-9]+'),
  body('password')
  .trim()
  .escape()
  .notEmpty()
  .isLength({min:8})
  .matches('(?=.*[a-zA-Z])(?=.*[0-9])[a-zA-Z0-9]+')  
];

router.get("/", controller.index);
router.get("/urlTemporal", controller.urlTemporal);
router.post("/urlTemporal", rules, controller.auth);
router.get("/urlTemporalCert", changePortX509.changePortX509, vTokenCert.verifyCert, controller.urlTemporalCert);
router.post("/urlTemporalCheckKey", controller.checkKey);
router.get("/api/actualTime", controller.actualTime);

module.exports = router;  //para poder exportar la ruta a otros códigos