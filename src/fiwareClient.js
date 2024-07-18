const axios = require('axios');
const config = require('./config');
const logger = require('./logger');

async function sendToFiware(attributes) {
    const orionUrl = `${config.fiware.orionBaseUrl}/entities/${config.fiware.entityId}/attrs`;

    try {
        await axios.get(`${config.fiware.orionBaseUrl}/entities/${config.fiware.entityId}`, {
            headers: {
                'Fiware-Service': config.fiware.service,
                'Fiware-ServicePath': config.fiware.servicePath
            }
        });
        logger.info("La entidad existe, actualizando...");
    } catch (error) {
        if (error.response && error.response.status === 404) {
            logger.info("La entidad no existe, creando...");
            await axios.post(`${config.fiware.orionBaseUrl}/entities`, {
                id: config.fiware.entityId,
                type: "Device",
                ...attributes
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Fiware-Service': config.fiware.service,
                    'Fiware-ServicePath': config.fiware.servicePath
                }
            });
            logger.info("Entidad creada");
            return;
        } else {
            throw error;
        }
    }

    const headers = {
        'Content-Type': 'application/json',
        'Fiware-Service': config.fiware.service,
        'Fiware-ServicePath': config.fiware.servicePath
    };

    await axios.post(orionUrl, attributes, { headers });
    logger.info("Datos enviados a Orion Context Broker");
}

module.exports = sendToFiware;
