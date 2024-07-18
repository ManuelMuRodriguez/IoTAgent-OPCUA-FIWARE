const express = require('express');
const { connectOpcua, readOpcuaData } = require('./opcuaClient');
const sendToFiware = require('./fiwareClient');
const logger = require('./logger');

const app = express();
const port = process.env.PORT || 3000;

let opcuaClient, opcuaSession, mappings;

async function main() {
    try {
        const connection = await connectOpcua();
        opcuaClient = connection.client;
        opcuaSession = connection.session;
        mappings = connection.mappings;

        setInterval(async () => {
            try {
                const attributes = await readOpcuaData(opcuaSession, mappings);
                await sendToFiware(attributes);
            } catch (err) {
                logger.error("Error al leer variables o enviar datos: " + err.message);
                if (err.response) {
                    logger.error("Detalles del error: " + JSON.stringify(err.response.data));
                }
            }
        }, 1000);
    } catch (err) {
        logger.error("Error al conectar con el servidor OPC UA: " + err.message);
    }
}

app.listen(port, () => {
    logger.info(`Servidor IoT Agent corriendo en el puerto ${port}`);
    main();
});
