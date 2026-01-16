const jwt = require('jsonwebtoken');
const nodemailer = require("nodemailer");

const index = (req, res) => {
  res.render("contacto", { title: "Contacto", nombre: "" });
};

const indexLog = (req, res) => {
  const token = req.cookies.authToken;
  if (token) {
    const verified = jwt.verify(token, process.env.JWT_SECRET);  
    return res.render("contacto", { title: "Contacto", nombre: "", layout: "./layouts/layout-private", logado: true, username: verified.username });
  } else {
    return res.render("contacto", { title: "Contacto", nombre: "" });
  };
  
};

const submit = async (req, res) => {
  console.log(req.body);
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  try {
    const info = await transporter.sendMail({
      from: `"${req.body.nombre}" <${req.body.correo}>`, // dirección de quien envía el formulario
      to: "bar@example.com, baz@example.com",
      subject: "Formulario de Contacto",
      text: req.body.mensaje, // plain‑text body
      html: `<pre>${req.body.mensaje}</pre>`, // HTML body
    });
    console.info(info);
  } catch (error) {
    console.error("Error al enviar el correo:", error);
    res.status(500).render("contacto", { title: "Contacto", enviado: false, visible: true, deshabilitado: true,
      nombre: req.body.nombre, correo: req.body.correo, mensaje: req.body.mensaje, logado: req.body.logado });
  }

  res.render("contacto", { title: "Contacto", enviado: true, visible: true, deshabilitado: true, 
    nombre: req.body.nombre, correo: req.body.correo, mensaje: req.body.mensaje, logado: req.body.logado });
};

module.exports = {
  index,
  indexLog,
  submit,
};
