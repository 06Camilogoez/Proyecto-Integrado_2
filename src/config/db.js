const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        let uri = process.env.MONGO_URI;

        // Si es la ruta local por defecto y no hay mongod corriendo, levantamos memoria
        try {
            await mongoose.connect(uri || 'mongodb://127.0.0.1:27017/peliculas_db', { serverSelectionTimeoutMS: 2000 });
            console.log('MongoDB conectado');
            return;
        } catch (localErr) {
            console.log('Iniciando base de datos MongoDB local...');
            const { MongoMemoryServer } = require('mongodb-memory-server');
            const mongod = await MongoMemoryServer.create();
            uri = mongod.getUri();
            await mongoose.connect(uri);
            console.log('MongoDB conectado');
        }
    } catch (error) {
        console.error('Error al conectar a MongoDB:', error.message);
        process.exit(1);
    }
};

module.exports = connectDB;
