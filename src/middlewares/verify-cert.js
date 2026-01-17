const crypto = require('crypto');
const { buffer } = require('stream/consumers');

const verifyCert = (req, res, next) => {    

    const bufferCert = req.socket.getPeerCertificate(true);

    if (bufferCert.raw === undefined) {
        return res.status(401).render('login/cert_Empty', { title: "Certificado no proporcionado", layout: "./layouts/layout-public" });
    };

    const clientCertReq = req.socket.getPeerCertificate(true).raw;    
    const clientCert = new crypto.X509Certificate(clientCertReq);      
    console.log('Certificado del cliente recibido:', clientCert);    

    if (!clientCert) {
        return res.status(401).render('login/cert_Empty', { title: "Certificado no proporcionado", layout: "./layouts/layout-public" });
    }

    try {
        
        const subject = clientCert.subject.split('\n'); 
        const issuer = clientCert.issuer.split('\n'); 
        const infoAccess = clientCert.infoAccess.split('\n');  

        for (let i = 0; i < subject.length; i++) {
            subject[i].substring(0,3) == 'GN=' ? (nombre = subject[i].slice(3)) : null; 
            subject[i].substring(0,3) == 'SN=' ? (apellidos = subject[i].slice(3)) : null;
            subject[i].substring(0,3) == 'CN=' ? (dni = (subject[i].split(' ').at(-1))) : null;
        };

        for (let i = 0; i < issuer.length; i++) {
            issuer[i].substring(0,3) == 'CN=' ? (emitidoPor = issuer[i].slice(3)) : null;             
        };

        for (let i = 0; i < infoAccess.length; i++) {
            infoAccess[i].substring(0,4) == 'OCSP' ? (rutaOCSP = infoAccess[i].slice(11)) : null;             
        };

        console.log('Nombre: ', nombre);
        console.log('Apellidos: ', apellidos);
        console.log('DNI: ', dni); 
        console.log('Emitido por: ', emitidoPor);   
        console.log('Ruta OCSP: ', rutaOCSP);                
        console.log('Válido desde: ', clientCert.validFrom);        
        console.log('Válido hasta: ', clientCert.validTo);    
        console.log('Número de serie: ', clientCert.serialNumber);         

        const userCert = {
            nombreC: nombre,
            apellidos: apellidos,
            dni: dni,
            emitidoPor: emitidoPor,
            rutaOCSP: rutaOCSP,            
            validoDesde: clientCert.validFrom,
            validoHasta: clientCert.validTo,
            numeroSerie: clientCert.serialNumber
        };

        req.user = { userCert }; 
        console.log("Reg.user desde Middleware: ", req.user);
        
        next();

    } catch (error) {
        console.error('Error al procesar el certificado:', error);
        res.status(400).render('login/cert_Error', { title: "Error al procesar el certificado", layout: "./layouts/layout-public" });
    }
    
    };
    
    module.exports = {
        verifyCert
};