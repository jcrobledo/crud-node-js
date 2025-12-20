const pool = require('./mysql');

const store = async (producto) => {
    const sql = 'INSERT INTO products (title, description) VALUES (?, ?)';
    try {
        const [result] = await pool.execute(sql, [producto.nombre, producto.descripcion]);
        return result.insertId;        
    } catch (error) {
        throw error;
    };    
};

const findAll = async () => {
    const sql = 'SELECT * FROM products';
    try {
        const [rows] = await pool.execute(sql);
        return rows;      
    } catch (error) {
        throw error;
    };      
};

const findById = async (id) => {
    const sql = 'SELECT * FROM products WHERE id = ?';
    try {
        const [rows] = await pool.execute(sql, [id]);
        return rows[0];      
    } catch (error) {
        throw error;
    };      
};

const update = async (id, producto) => {
    const sql = 'UPDATE products SET title = ?, description = ? WHERE id = ?';
    try {
        await pool.execute(sql, [producto.title, producto.description, id]);
    } catch (error) {
        throw error;
    };
};

const deleteID = async (id) => {
    const sql = 'DELETE FROM products WHERE id = ?';
    try {
        await pool.execute(sql, [id]);
    } catch (error) {
        throw error;
    };
};

module.exports = {
    store,
    findAll,
    findById,
    update,
    deleteID
};