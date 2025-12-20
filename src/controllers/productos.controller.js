const model = require("../models/product");

const index = async (req, res) => {
  try {
    const productos = await model.findAll();
    return res.render("productos/index", { title: "Productos", productos });
  } catch (error) {
    console.error("Error al listar todos los productos:", error);
    return res.status(500).send("Error al listar todos los productos");
  }
};

const show = async (req, res) => {
  const { id } = req.params;
  try {
    const producto = await model.findById(id);
    if (!producto) {
      return res.status(404).send("Producto no encontrado");
    }
    res.render("productos/show", { title: "Producto", producto });
  } catch (error) {
    console.error("Error al obtener el producto:", error);
    res.status(500).send("Error al obtener el producto");
  }
};

const create = (req, res) => {
  res.render("productos/create", { title: "Crear Producto" });
};

const store = async (req, res) => {
  const nuevoProducto = {
    nombre: req.body.nombre,
    descripcion: req.body.descripcion,
  };
  try {
    const result = await model.store(nuevoProducto);    
    res.redirect("/productos");
  } catch (error) {
    console.error("Error al almacenar el producto:", error);
    return res.status(500).send("Error al almacenar el producto");
  }
};

const updateProducto = (req, res) => {  
  const { id } = req.params;
  const producto = {
    id: id,
    title: req.query.title,
    description: req.query.description,
  };
  res.render(`productos/update`, { title: "Actualizar Producto", producto });
};

const update = async (req, res) => {  
  const id = req.body.id;
  const updatedProducto = {
    title: req.body.nombre,
    description: req.body.descripcion,
  };  
  try {
    const result = await model.update(id, updatedProducto);
    res.redirect("/productos");
  } catch (error) {
    console.error("Error al actualizar el producto:", error);
    res.status(500).send("Error al actualizar el producto");
  }
};

const deleteProducto = async (req, res) => {
  const { id } = req.params;
  const producto = {
    id: id,
    title: req.query.title,
    description: req.query.description,
  };
  res.render(`productos/delete`, { title: "Eliminar Producto", producto });
};

const deleteID = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await model.deleteID(id);
    res.redirect("/productos");
  } catch (error) {
    console.error("Error al eliminar el producto:", error);
    res.status(500).send("Error al eliminar el producto");
  }
};

module.exports = {
  index,
  show,
  create,
  store,
  updateProducto,
  update,
  deleteProducto,
  deleteID,
};
