const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/peliculas_db');
        console.log(`[Base de Datos] Conexión exitosa a MongoDB: ${conn.connection.host}/${conn.connection.name}`);
    } catch (error) {
        console.error('[Base de Datos] Error al conectar a MongoDB:', error.message);
        console.error('Asegúrate de que MongoDB esté corriendo localmente o configura una URL válida de MongoDB Atlas en el archivo .env (MONGO_URI).');
        process.exit(1);
    }
};

module.exports = connectDB;
