const generateKey = (req, res, next) => {

    let key = '';
    const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';    

    for (let i = 0; i < 6; i++) {
        key += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
    }
    global.dinKEY = key;   
    req.user = key;
    next();

};

module.exports = {
  generateKey,   
};