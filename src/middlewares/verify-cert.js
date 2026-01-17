const crypto = require('crypto');
const { getCertStatus } = require('easy-ocsp');

const verifyCert = async (req, res, next) => {    

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

    let resultOCSP = {};

    try {  
        // comprobación OCSP        
        // La función extrae automáticamente la URL del respondedor OCSP
        //  y el certificado del emisor del propio certificado de usuario.        
        const ocspResult = await getCertStatus(clientCertReq); 

        console.log('Resultado OCSP:', ocspResult);

        if (ocspResult.status === 'good') {
            resultOCSP = {
                valido: true, 
                mensaje: 'Certificado activo y válido'
            };            
        } else if (ocspResult.status === 'revoked') {
            resultOCSP = { 
                valido: false, 
                estado: "revocado",
                mensaje: 'Certificado REVOCADO',
                motivo: ocspResult.revocationReason 
            };
        } else {
            resultOCSP = { 
                valido: false, 
                estado: 'desconocido',
                mensaje: 'Estado del Certificado Desconocido' 
            };
        }
    } catch (error) {        
        console.error('Error al procesar el certificado (OCSP):', error);
        res.status(400).render('login/cert_Error', { title: "Error al procesar el certificado", layout: "./layouts/layout-public" });
    };    

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
            numeroSerie: clientCert.serialNumber,
            resultOCSP
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