const express = require('express');
const router = express.Router();
const controller = require('../controllers/categorias.controller');

router.get("/", controller.index);
router.get("/create", controller.createCategoria);
router.post("/create", controller.storeCategoria);
router.get("/:id", controller.show);
router.get("/:id/update", controller.updateCategoria);
router.put("/:id/update", controller.update);
router.get("/:id/delete", controller.deleteCategoria);
router.delete("/:id/delete", controller.deleteID);

module.exports = router;