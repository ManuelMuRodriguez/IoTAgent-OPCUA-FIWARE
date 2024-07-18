const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const { connectOpcua, readOpcuaData, reloadMappings } = require('./opcuaClient');
const sendToFiware = require('./fiwareClient');
const logger = require('./logger');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

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

// Endpoint para verificar el estado del servidor
app.get('/status', (req, res) => {
    res.send('IoT Agent is running');
});

// Endpoint para ver los logs (de manera básica)
app.get('/logs', (req, res) => {
    const logFilePath = require('./config').logFilePath;
    fs.readFile(logFilePath, 'utf8', (err, data) => {
        if (err) {
            res.status(500).send('Error reading log file');
            return;
        }
        res.send(`<pre>${data}</pre>`);
    });
});

// Endpoint para obtener la configuración
app.get('/config', (req, res) => {
    res.json(require('./config'));
});

// Endpoint para añadir nuevas variables al archivo de mapeo
app.post('/add-mapping', (req, res) => {
    const newMapping = req.body;

    if (!newMapping.ocb_id || !newMapping.opcua_id) {
        return res.status(400).send('ocb_id and opcua_id are required');
    }

    mappings.push(newMapping);

    fs.writeFile(config.mappingsFilePath, JSON.stringify(mappings, null, 2), (err) => {
        if (err) {
            logger.error("Error al escribir el archivo de mapeo: " + err.message);
            return res.status(500).send('Error writing mappings file');
        }

        reloadMappings(); // Recargar el archivo de mapeo
        logger.info(`Nuevo mapeo añadido: ${JSON.stringify(newMapping)}`);
        res.status(201).send('Mapping added successfully');
    });
});

app.listen(port, () => {
    logger.info(`Servidor IoT Agent corriendo en el puerto ${port}`);
    main();
});
