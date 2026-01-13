const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    
    const token = req.cookies.authToken;        

    if (!token) {
        return res.render('login_No_JWT', { title: "Acceso Denegado", layout: "./layouts/layout-public" });
    }
    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified; // Adjunta el payload al request           
        next();
    } catch (err) {
        return res.render('login_No_JWT', { title: "Acceso Denegado", layout: "./layouts/layout-public" });
    }

};

module.exports = {
  verifyToken
};