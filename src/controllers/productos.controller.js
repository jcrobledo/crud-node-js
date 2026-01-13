const model = require("../models/product");
const modelCat = require("../models/category");

const index = async (req, res) => {
  try {
    const productos = await model.findAll();
    const categorias = await modelCat.findAll();

    // Mapear las categorías a sus IDs para fácil acceso
    const categoriaMap = {};
    categorias.forEach((categoria) => {
      categoriaMap[categoria.id] = categoria;
    });

    return res.render("productos/index", {
      title: "Productos",
      layout: "./layouts/layout-private",
      productos,
      categoriaMap,
      username: req.user.username,
    });
  } catch (error) {
    console.error("Error al listar todos los productos:", error);
    return res.status(500).send("Error al listar todos los productos");
  }
};

const show = async (req, res) => {
  const { id } = req.params;
  try {
    const producto = await model.findById(id);
    const categoria = await modelCat.findByPk(producto.categoryID);
    if (!producto) {
      return res.status(404).send("Producto no encontrado");
    }
    res.render("productos/show", { title: "Producto", producto, categoria, layout: "./layouts/layout-private", username: req.user.username });
  } catch (error) {
    console.error("Error al obtener el producto:", error);
    res.status(500).send("Error al obtener el producto");
  }
};

const create = async (req, res) => {
  try {
    const categorias = await modelCat.findAll();
    res.render("productos/create", { title: "Crear Producto", categorias, layout: "./layouts/layout-private", username: req.user.username });
  } catch (error) {
    console.error("Error al cargar categorías:", error);
    return res.status(500).send("Error al cargar categorías");
  }
};

const store = async (req, res) => {
  const nuevoProducto = {
    nombre: req.body.nombre,
    descripcion: req.body.descripcion,
    categoriaID: req.body.categoria,
  };
  try {
    const result = await model.store(nuevoProducto);
    res.redirect("/productos");
  } catch (error) {
    console.error("Error al almacenar el producto:", error);
    return res.status(500).send("Error al almacenar el producto");
  }
};

const updateProducto = async (req, res) => {
  const { id } = req.params;
  const producto = {
    id: id,
    title: req.query.title,
    description: req.query.description,
    categoria: req.query.categoria,
  };  
  try {
    const categorias = await modelCat.findAll();
    res.render(`productos/update`, { title: "Actualizar Producto", producto, categorias, layout: "./layouts/layout-private", username: req.user.username });
  } catch (error) {
    console.error("Error al cargar categorías:", error);
    return res.status(500).send("Error al cargar categorías");
  }  
};

const update = async (req, res) => {
  const id = req.body.id;
  const updatedProducto = {
    title: req.body.nombre,
    description: req.body.descripcion,
    categoryID: req.body.categoria
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
    category: req.query.categoria
  };
  res.render(`productos/delete`, { title: "Eliminar Producto", producto, layout: "./layouts/layout-private", username: req.user.username });
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
