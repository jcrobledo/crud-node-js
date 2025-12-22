const model = require("../models/category");

const createCategoria = (req, res) => {
  res.render("categorias/create", { title: "Crear Categoría" });
};

const storeCategoria = async (req, res) => {
  const { nombre, descripcion } = req.body;
  const nuevaCategoria = {
    title: nombre,
    description: descripcion,
  };
  try {
    const result = await model.create(nuevaCategoria);
    res.redirect("/categorias");
  } catch (error) {
    console.error("Error al almacenar la categoría:", error);
    return res.status(500).send("Error al almacenar la categoría");
  }
};

const index = async (req, res) => {
  try {
    const categorias = await model.findAll();
    res.render("categorias/index", { title: "Categorías", categorias });
  } catch (error) {
    return res.status(500).send("Error al listar todas las categorías");
  }
};

const show = async (req, res) => {
  const { id } = req.params;
  try {
    const categoria = await model.findByPk(id);
    if (!categoria) {
      return res.status(404).send("Categoría no encontrada");
    }
    res.render("categorias/show", { title: "Detalle de Categoría", categoria });
  } catch (error) {
    console.error("Error al obtener la categoría:", error);
    res.status(500).send("Error al obtener la categoría");
  }
};

const updateCategoria = (req, res) => {
  const { id } = req.params;
  const categoria = {
    id: id,
    title: req.query.title,
    description: req.query.description,
  };
  res.render(`categorias/update`, { title: "Actualizar Categoría", categoria });
};

const update = async (req, res) => {
  const { id } = req.params;
  const updatedCategoria = {
    title: req.body.nombre,
    description: req.body.descripcion,
  };
  try {
    const result = await model.update(updatedCategoria, { where: { id: id } });
    if (!updateCategoria) {
      return res.status(404).send("Categoría no encontrada");
    }
    res.redirect("/categorias");
  } catch (error) {
    console.error("Error al actualizar la categoría:", error);
    res.status(500).send("Error al actualizar la categoría");
  }
};

const deleteCategoria = (req, res) => {
  const { id } = req.params;
  const categoria = {
    id: id,
    title: req.query.title,
    description: req.query.description,
  };
  res.render("categorias/delete", { title: "Eliminar Categoría", categoria });
};

const deleteID = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await model.destroy({ where: { id: id } });
    res.redirect("/categorias");
  } catch (error) {
    console.error("Error al eliminar la categoría:", error);
    res.status(500).send("Error al eliminar la categoría");
  }  
};

module.exports = {
  index,
  show,
  createCategoria,
  storeCategoria,
  updateCategoria,
  update,
  deleteCategoria,
  deleteID,
};
