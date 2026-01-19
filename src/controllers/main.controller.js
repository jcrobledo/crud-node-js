const jwt = require('jsonwebtoken');
const path = require('path');

const index = (req, res) => {

    const token = req.cookies.authToken;

    if (!token) {
        return res.render("index", { title: "Inicio" });
    } else {
        const verified = jwt.verify(token, process.env.JWT_SECRET);    
        return res.render("index", { title: "Inicio", layout: "./layouts/layout-private", username: verified.username });
    };

};

const indexLog = (req, res) => {
    const token = req.cookies.authToken;
    if (token) {
        const verified = jwt.verify(token, process.env.JWT_SECRET);    
        return res.render("index", { title: "Inicio", layout: "./layouts/layout-private", username: verified.username });
    } else {
        return res.redirect("/");
    };    
};

module.exports = {
    index, 
    indexLog,    
};
