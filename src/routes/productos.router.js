const express = require("express");
const router = express.Router();
const querystring = require("querystring"); // Módulo Node.js para pasar a String los parámetros de la llamada

router.get("/", (req, res) => {
  const query = querystring.stringify(req.query);  
  fetch("https://fakestoreapi.com/products?" + query)
    .then((res) => res.json())
    .then((productos) => res.send(productos));
});

router.get("/:id", (req, res) => {
 fetch("https://fakestoreapi.com/products/" + req.params.id)
  .then((res) => res.json())
  .then(producto => res.send(producto)); 
});



module.exports = router;  //para poder exportar la ruta a otros códigos
