const express = require("express");
const router = express.Router();
const controller = require('../controllers/productos.controller');

router.get("/", controller.index);
router.get("/create", controller.create);
router.post("/create", controller.store);
router.get("/:id", controller.show);
router.get("/:id/update", controller.updateProducto);
router.put("/:id/update", controller.update);
router.get("/:id/delete", controller.deleteProducto);
router.delete("/:id/delete", controller.deleteID);

module.exports = router;  //para poder exportar la ruta a otros códigos
