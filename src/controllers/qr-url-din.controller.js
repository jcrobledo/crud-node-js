const bcrypt = require("bcrypt");
const model = require("../models/user");
const modelMark = require("../models/mark");
const { validationResult } = require('express-validator');
const QRCode = require('qrcode');
const nodemailer = require("nodemailer");
const path = require('path');

let clave = '';

const index = async (req, res) => {

    try {
        const urlTemp = "https://192.168.31.100/codigoQR/urlTemporal";

        const qrCodeBuffer = await QRCode.toBuffer(urlTemp, {
            errorCorrectionLevel: 'Q',
            type: 'image/png',
            margin: 1,
            width: 256
        });

        const qrBase64 = qrCodeBuffer.toString('base64'); // Convertir el buffer a Base64        
        const qrImageSrc = `data:image/png;base64,${qrBase64}`; // Crear el Data URI para la etiqueta <img> 

        const fechaActual = new Date();
        const opciones = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
        const fecha = fechaActual.toLocaleDateString('es-ES', opciones);

        const hora = fechaActual.toLocaleTimeString('es-ES', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false // true para formato AM/PM
        });

        res.render('QRurlDin/index', { title: "Código QR", qrImageSrc, fecha, hora });

    } catch (error) {
        console.error("Error al generar el QR: ", error);
        return res.status(500).send("Error al generar el QR");

    };

};

const actualTime = (req, res) => {
    const fechaActual = new Date();
    const hora = fechaActual.toLocaleTimeString('es-ES', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false // true para formato AM/PM
    });
    res.json({ hora });
};

const urlTemporal = (req, res) => {

    let incorrecto = "";
    let error = "";
    let noExiste = "";
    let escondido = "";
    let escondidoBT = "";
    let escondidoFkey = "";
    let nombre = "";
    let dni = "";
    let user = "";
    let fichajeOK = "";
    let noUsuCert = "";

    const fechaActual = new Date();
    const opciones = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
    const fecha = fechaActual.toLocaleDateString('es-ES', opciones);

    const hora = fechaActual.toLocaleTimeString('es-ES', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false // true para formato AM/PM
    });

    if (Object.keys(req.query).length > 0) {
        incorrecto = req.query.incorrecto;
        error = req.query.error;
        noExiste = req.query.noExiste;
        escondido = req.query.escondido;
        escondidoBT = req.query.escondidoBT;
        escondidoFkey = req.query.escondidoFkey;
        nombre = req.query.nombre;
        fichajeOK = req.query.fichajeOK;
        noUsuCert = req.query.noUsuCert;

        return res.render('QRurlDin/urlTemporal', { title: "URL para Fichajes", layout: "./layouts/layout-mark", fecha, hora, incorrecto, error, noExiste, escondido, escondidoBT, escondidoFkey, nombre, dni, user, fichajeOK, noUsuCert });
    };
    res.render('QRurlDin/urlTemporal', { title: "URL para Fichajes", layout: "./layouts/layout-mark", fecha, hora, incorrecto: "", error: "", noExiste: "", escondido: "true", escondidoBT: "false", escondidoFkey: "true", nombre: "", dni: "", user: "", fichajeOK: "", noUsuCert: "" });
};

const auth = async (req, res) => {

    const result = validationResult(req);

    if (!result.error) {

        const usuarioAuth = {
            nombre: req.body.nombre,
            password: req.body.password,
        };

        const fechaActual = new Date();
        const opciones = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
        const fechaAc = fechaActual.toLocaleDateString('es-ES', opciones);

        const hoy = new Date();
        const yyyy = hoy.getFullYear();
        const mm = String(hoy.getMonth() + 1).padStart(2, '0'); // Enero es 0
        const dd = String(hoy.getDate()).padStart(2, '0');
        const fechaStringDate = `${dd}-${mm}-${yyyy}`;

        try {

            const query = await model.findById(usuarioAuth.nombre);

            if (query) {
                const loginCorrecto = await bcrypt.compare(usuarioAuth.password, query.password);

                if (loginCorrecto) {

                    const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
                    clave = '';
                    for (let i = 0; i < 8; i++) {
                        clave += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
                    }

                    console.log("Clave generada en auth: ", clave);

                    const textoEmail = "QronosBOOK - CLAVE de UN SOLO USO para fichar hoy " + fechaStringDate + " es: " + clave;
                    const textoSubject = "QRonosBOOK - Clave Temporal para Fichar fecha " + fechaStringDate;

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
                            from: "jcrm-costero@alwaysdata.net", // dirección de quien envía el formulario
                            to: query.email,
                            subject: textoSubject,
                            text: textoEmail, // plain‑text body
                            html: `<p style="font-family: Arial, sans-serif; font-size: 16px; color: darkblue; font-weight: bold;">${textoEmail}</p>`, // HTML body
                        });
                        console.info(info);
                    } catch (error) {
                        console.error("Error al enviar el correo:", error);
                        return res.render('QRurlDin/errorGeneral', { title: "Fichajes: Error General", layout: "./layouts/layout-mark" });
                    };

                    return res.render('QRurlDin/urlTemporal', { title: "URL para Fichajes", layout: "./layouts/layout-mark", incorrecto: "true", error: "", noExiste: "", escondido: "true", escondidoBT: "true", escondidoFkey: "false", nombre: query.user, dni: query.dni, user: query.user, fecha: fechaAc, hora: req.body.hora, fichajeOK: "", noUsuCert: "" });

                } else {
                    return res.redirect('/codigoQR/urlTemporal?incorrecto=true&error=&noExiste=&escondido=false&escondidoBT=false&escondidoFkey=true&noUsuCert=');
                };
            } else {
                return res.redirect('/codigoQR/urlTemporal?incorrecto=&error=&noExiste=true&escondido=false&escondidoBT=false&escondidoFkey=true&noUsuCert=');
            };

        } catch (error) {
            console.error("Error general de acceso:", error);
            return res.redirect('/codigoQR/urlTemporal?incorrecto=&error=true&noExiste=&escondido=false&escondidoBT=false&escondidoFkey=true&noUsuCert=');
        }
    } else {
        return res.redirect('/codigoQR/urlTemporal?incorrecto=&error=true&noExiste=&escondido=false&escondidoBT=false&escondidoFkey=true&noUsuCert=');
    };

};

const checkKey = async (req, res) => {

    const fechaActual = new Date();
    const opciones = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
    const fechaAc = fechaActual.toLocaleDateString('es-ES', opciones);
    
    console.log("req.body: ", req.body);
    console.log("req.body.nombrekey: ", req.body.nombreKey);
    console.log("clave: ", clave);

    if (req.body.nombreKey === clave) {

        const hoy = new Date();
        const yyyy = hoy.getFullYear();
        const mm = String(hoy.getMonth() + 1).padStart(2, '0'); // Enero es 0
        const dd = String(hoy.getDate()).padStart(2, '0');
        const fechaStringID = `${yyyy}${mm}${dd}`;
        const fechaStringDate = `${yyyy}-${mm}-${dd}`;
        let markToDay;

        try {
            const query = await modelMark.lastMark();
            if (query.length !== 0) {
                let lastFecha = query[0].date;
                console.log('Registro traído: ', query);
                console.log('Última Fecha en BBDD: ', lastFecha);
                console.log("Tipo de dato fecha: ", typeof lastFecha);

                lastFecha = new Date(lastFecha);

                const yyyyBBDD = lastFecha.getFullYear();
                const mmBBDD = String(lastFecha.getMonth() + 1).padStart(2, '0'); // Enero es 0
                const ddBBDD = String(lastFecha.getDate()).padStart(2, '0');

                const fechaBBDD = `${yyyyBBDD}-${mmBBDD}-${ddBBDD}`;

                const sonMismoDia =
                    hoy.getFullYear() === lastFecha.getFullYear() &&
                    hoy.getMonth() === lastFecha.getMonth() &&
                    hoy.getDate() === lastFecha.getDate();

                console.log("Son el mismo día: ", sonMismoDia); // true

                if (sonMismoDia) {
                    console.log("TRUE: fecha BBDD : ", fechaBBDD, " Son el MISMO día: ", fechaStringDate);
                    const markToDayInt = query[0].id;
                    markForStr = markToDayInt.toString().slice(8);
                    markForInt = parseInt(markForStr, 10);
                    markForInt++;
                    markToDay = markForInt.toString().padStart(4, '0');
                    console.log('markToDay: ', markToDay);
                } else {
                    console.log("FALSE: fecha BBDD : ", fechaBBDD, " es anterior la de hoy: ", fechaStringDate);
                    markToDay = "0001";
                    console.log('markToDay: ', markToDay);
                };

            } else {
                markToDay = "0001";
            };
        } catch (error) {
            console.error("Error al recuperar el último fichaje:", error);
            return res.render('QRurlDin/errorGeneral', { title: "Fichajes: Error General", layout: "./layouts/layout-mark" });
        }

        const idStr = fechaStringID + markToDay;
        const idInt = parseInt(idStr, 10);

        const nuevoMarcaje = {
            id: idInt,
            dni: req.body.dni,
            user: req.body.user,
            date: fechaStringDate,
            time: req.body.hora
        };

        console.log(nuevoMarcaje);

        try {
            const result = await modelMark.store(nuevoMarcaje);

        } catch (error) {
            console.error("Error guardar el fichaje:", error);
            return res.render('QRurlDin/errorGeneral', { title: "Fichajes: Error General", layout: "./layouts/layout-mark" });
        }

        return res.render('QRurlDin/urlTemporal', { title: "Fichaje Correcto", layout: "./layouts/layout-mark", incorrecto: "true", error: "", noExiste: "", escondido: "true", escondidoBT: "true", escondidoFkey: "true", nombre: req.body.user, dni: req.body.dni, user: req.body.user, fecha: fechaAc, hora: req.body.hora, fichajeOK: "true", noUsuCert: "" });

    } else {

        return res.render('QRurlDin/urlTemporal', { title: "Fichaje Erróneo", layout: "./layouts/layout-mark", incorrecto: "true", error: "", noExiste: "", escondido: "true", escondidoBT: "true", escondidoFkey: "false", nombre: req.body.user, dni: req.body.dni, user: req.body.user, fecha: fechaAc, hora: req.body.hora, fichajeOK: "false", noUsuCert: "" });

    };

};

const urlTemporalCert = async (req, res) => {

    if (req.user.datos.tag == "NoHayCertificado") {
        return res.status(401).render('QRurlDin/cert_Empty', { title: "Certificado no proporcionado", layout: "./layouts/layout-mark" });
    };
    
    if (req.user.datos.tag == "NoHayOCSP") {
        console.error('Error al procesar el certificado (OCSP):', req.user.datos.error);
        return res.status(400).render('QRurlDin/cert_Error', { title: "Error al procesar el certificado", layout: "./layouts/layout-mark", mensajeOCSP: req.user.datos.error });
    };

    if (req.user.datos.tag == "ErrorProceso") {
        console.error('Error al procesar el certificado:', req.user.datos.error);
        return res.status(400).render('QRurlDin/cert_Error', { title: "Error al procesar el certificado", layout: "./layouts/layout-mark" });
    };    

    const usuarioAuth = {
        dni: req.user.userCert.dni,
        nombre: req.user.userCert.nombreC,
        resultOCSP: req.user.userCert.resultOCSP
    };

    const fechaActual = new Date();
    const opciones = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
    const fechaAc = fechaActual.toLocaleDateString('es-ES', opciones);

    if (usuarioAuth.resultOCSP.valido) {

        try {

            const query = await model.findByDni(usuarioAuth.dni);

            if (query) {

                const hoy = new Date();
                const yyyy = hoy.getFullYear();
                const mm = String(hoy.getMonth() + 1).padStart(2, '0'); // Enero es 0
                const dd = String(hoy.getDate()).padStart(2, '0');
                const fechaStringID = `${yyyy}${mm}${dd}`;
                const fechaStringDate = `${yyyy}-${mm}-${dd}`;
                let markToDay;

                try {
                    const query = await modelMark.lastMark();
                    if (query.length !== 0) {
                        let lastFecha = query[0].date;
                        console.log('Registro traído: ', query);
                        console.log('Última Fecha en BBDD: ', lastFecha);
                        console.log("Tipo de dato fecha: ", typeof lastFecha);

                        lastFecha = new Date(lastFecha);

                        const yyyyBBDD = lastFecha.getFullYear();
                        const mmBBDD = String(lastFecha.getMonth() + 1).padStart(2, '0'); // Enero es 0
                        const ddBBDD = String(lastFecha.getDate()).padStart(2, '0');

                        const fechaBBDD = `${yyyyBBDD}-${mmBBDD}-${ddBBDD}`;

                        const sonMismoDia =
                            hoy.getFullYear() === lastFecha.getFullYear() &&
                            hoy.getMonth() === lastFecha.getMonth() &&
                            hoy.getDate() === lastFecha.getDate();

                        console.log("Son el mismo día: ", sonMismoDia); // true

                        if (sonMismoDia) {
                            console.log("TRUE: fecha BBDD : ", fechaBBDD, " Son el MISMO día: ", fechaStringDate);
                            const markToDayInt = query[0].id;
                            markForStr = markToDayInt.toString().slice(8);
                            markForInt = parseInt(markForStr, 10);
                            markForInt++;
                            markToDay = markForInt.toString().padStart(4, '0');
                            console.log('markToDay: ', markToDay);
                        } else {
                            console.log("FALSE: fecha BBDD : ", fechaBBDD, " es anterior la de hoy: ", fechaStringDate);
                            markToDay = "0001";
                            console.log('markToDay: ', markToDay);
                        };

                    } else {
                        markToDay = "0001";
                    };
                } catch (error) {
                    console.error("Error al recuperar el último fichaje:", error);
                    return res.render('QRurlDin/errorGeneral', { title: "Fichajes: Error General", layout: "./layouts/layout-mark" });
                }

                const idStr = fechaStringID + markToDay;
                const idInt = parseInt(idStr, 10);

                const nuevoMarcaje = {
                    id: idInt,
                    dni: query.dni,
                    user: query.user,
                    date: fechaStringDate,
                    time: req.query.hora
                };

                console.log(nuevoMarcaje);

                try {
                    const result = await modelMark.store(nuevoMarcaje);

                } catch (error) {
                    console.error("Error guardar el fichaje:", error);
                    return res.render('QRurlDin/errorGeneral', { title: "Fichajes: Error General", layout: "./layouts/layout-mark" });
                }

                return res.render('QRurlDin/urlTemporal', { title: "Fichaje Correcto", layout: "./layouts/layout-mark", incorrecto: "true", error: "", noExiste: "", escondido: "true", escondidoBT: "true", escondidoFkey: "true", nombre: "", dni: "", user: "", fecha: fechaAc, hora: req.query.hora, fichajeOK: "", noUsuCert: "true" });

            } else {
                return res.render('QRurlDin/urlTemporal', { title: "Fichaje Erróneo", layout: "./layouts/layout-mark", incorrecto: "true", error: "", noExiste: "True", escondido: "true", escondidoBT: "true", escondidoFkey: "true", nombre: "", dni: "", user: "", fecha: fechaAc, hora: req.query.hora, fichajeOK: "", noUsuCert: "false" });

            };

        } catch (error) {
            console.error("Error general de acceso:", error);
            return res.render('QRurlDin/errorGeneral', { title: "Fichajes: Error General", layout: "./layouts/layout-mark" });
        };

    } else {
        console.error('Error al procesar el certificado (OCSP):', error);
        return res.status(400).render('QRurlDin/cert_Error', { title: "Error al procesar el certificado", layout: "./layouts/layout-mark", mensajeOCSP: usuarioAuth.resultOCSP.mensaje });
    };

};

module.exports = {
    index,
    urlTemporal,
    actualTime,
    auth,
    checkKey,
    urlTemporalCert
};