require('dotenv').config();

module.exports = {
    opcua: {
        endpointUrl: process.env.OPCUA_ENDPOINT_URL
    },
    fiware: {
        orionBaseUrl: process.env.ORION_BASE_URL,
        entityId: process.env.ENTITYID,
        service: process.env.FIWARE_SERVICE,
        servicePath: process.env.FIWARE_SERVICE_PATH
    },
    mappingsFilePath: process.env.MAPPINGS_FILE_PATH,
    logFilePath: process.env.LOG_FILE_PATH
};
