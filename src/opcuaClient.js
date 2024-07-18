const opcua = require('node-opcua');
const fs = require('fs');
const config = require('./config');
const logger = require('./logger');

async function readOpcuaData(session, mappings) {
    const timestamp = new Date().toISOString();
    const attributes = {};

    for (const mapping of mappings) {
        const dataValue = await session.read({ nodeId: mapping.opcua_id, attributeId: opcua.AttributeIds.Value });
        attributes[mapping.ocb_id] = {
            type: "Float",
            value: dataValue.value.value,
            metadata: {
                timestamp: {
                    type: "DateTime",
                    value: timestamp
                }
            }
        };
    }

    return attributes;
}

async function connectOpcua() {
    const client = opcua.OPCUAClient.create({ endpointMustExist: false });
    await client.connect(config.opcua.endpointUrl);
    logger.info("Cliente conectado al servidor OPC UA");

    const session = await client.createSession();
    logger.info("Sesión creada");

    const mappings = JSON.parse(fs.readFileSync(config.mappingsFilePath, 'utf8'));

    return { client, session, mappings };
}

module.exports = { readOpcuaData, connectOpcua };
