const nodemailer = require("nodemailer");

const index = (req, res) => {
  res.render("contacto");
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
    res.status(500).send("Error al enviar el correo");
  }

  res.send("Enviado...");
};

module.exports = {
  index,
  submit,
};
