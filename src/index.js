require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/db');

const PORT = process.env.PORT || 4000;

const startServer = async () => {
    // Conectar a la base de datos
    await connectDB();

    app.listen(PORT, () => {
        console.log(`====================================================`);
        console.log(` Servidor de API REST en ejecución`);
        console.log(` URL Local: http://localhost:${PORT}`);
        console.log(` Documentación de Rutas: http://localhost:${PORT}/`);
        console.log(` Entorno: ${process.env.NODE_ENV || 'desarrollo'}`);
        console.log(`====================================================`);
    });
};

startServer();
