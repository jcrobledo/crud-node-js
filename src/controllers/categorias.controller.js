const categorias = [
  { id: 1, nombre: "Electrónica", descripcion: "Dispositivos electrónicos" },
  { id: 2, nombre: "Ropa", descripcion: "Prendas de vestir" },
  { id: 3, nombre: "Hogar", descripcion: "Artículos para el hogar" },
  { id: 4, nombre: "Libros", descripcion: "Publicaciones escritas" },
];

const index = (req, res) => {
  res.render("categorias/index", { title: "Categorías", categorias });
};

const show = (req, res) => {
  const { id } = req.params;
  const categoria = categorias.find((cat) => cat.id === parseInt(id));
  if (!categoria) {
    return res.status(404).send("Categoría no encontrada");
  }
  res.render("categorias/show", { title: "Detalle de Categoría", categoria });
};

const createCategoria = (req, res) => {
  res.render("categorias/create", { title: "Crear Nueva Categoría" });
};

const storeCategoria = (req, res) => {
  const { nombre, descripcion } = req.body;
  const nuevaCategoria = {
    id: categorias.length + 1,
    nombre,
    descripcion
  };
  categorias.push(nuevaCategoria);
  res.redirect("/categorias");
};

const updateCategoria = (req, res) => {  
  const { id } = req.params;
  const categoria = categorias.find((cat) => cat.id === parseInt(id));
  if (!categoria) {
    return res.status(404).send("Categoría no encontrada");
  }
  res.render(`categorias/update`, { title: "Actualizar Categoría", categoria });
};

const update = (req, res) => {
  const { id } = req.params;
  const { nombre, descripcion } = req.body;
  const categoria = categorias.find((cat) => cat.id === parseInt(id));
  if (!categoria) {
    return res.status(404).send("Categoría no encontrada");
  }
  const index = categorias.findIndex((cat) => cat.id === parseInt(id));
  categorias[index] = { id: parseInt(id), nombre, descripcion };
  res.redirect("/categorias");
};

const deleteCategoria = (req, res) => {
  const { id } = req.params;
  const categoria = categorias.find((cat) => cat.id === parseInt(id));
  if (!categoria) {
    return res.status(404).send("Categoría no encontrada");
  } 
  res.render("categorias/delete", { title: "Eliminar Categoría", categoria });
};

const deleteID = (req, res) => {
  const { id } = req.params;
  const index = categorias.findIndex((cat) => cat.id === parseInt(id));
  categorias.splice(index, 1);
  res.redirect("/categorias");
};

module.exports = {
  index,
  show,
  createCategoria,
  storeCategoria,
  updateCategoria,
  update,
  deleteCategoria,
  deleteID
};
