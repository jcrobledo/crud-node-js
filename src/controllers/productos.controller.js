const { title } = require("process");
const querystring = require("querystring"); // Módulo Node.js para pasar a String los parámetros de la llamada

const index = (req, res) => {
  const query = querystring.stringify(req.query);    
  fetch("https://fakestoreapi.com/products?" + query)
    .then((res) => res.json())
    .then((productos) => res.render("productos", { title: "Productos", productos }));
};

const show = (req, res) => {
 fetch("https://fakestoreapi.com/products/" + req.params.id)
  .then((res) => res.json())
  .then(producto => res.send(producto)); 
};

module.exports = {
    index, 
    show
};