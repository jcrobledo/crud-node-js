const pool = require('./mysql');

const store = async (usuario) => {
    const sql = 'INSERT INTO users (dni, user, password, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?)';
    try {
        const [result] = await pool.execute(sql, [usuario.dni, usuario.nombre, usuario.password, usuario.createdAt, usuario.updateAt]);
        return result.insertId;        
    } catch (error) {
        throw error;
    };    
};

const findById = async (nombre) => {
    const sql = 'SELECT * FROM users WHERE user = ?';
    try {
        const [rows] = await pool.execute(sql, [nombre]);
        return rows[0];      
    } catch (error) {
        throw error;
    };      
};

const findByDni = async (dni) => {
    const sql = 'SELECT * FROM users WHERE dni = ?';
    try {
        const [rows] = await pool.execute(sql, [dni]);
        return rows[0];      
    } catch (error) {
        throw error;
    };      
};

module.exports = {
    store,    
    findById,   
    findByDni,
};