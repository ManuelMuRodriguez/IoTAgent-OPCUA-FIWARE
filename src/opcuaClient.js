const fs = require('fs');
const path = require('path');
const opcua = require("node-opcua");
const config = require('./config');
const logger = require('./logger');

let mappings = JSON.parse(fs.readFileSync(config.mappingsFilePath, 'utf8'));

async function connectOpcua() {
    const client = opcua.OPCUAClient.create({ endpointMustExist: false });
    await client.connect(config.opcua.endpointUrl);
    const session = await client.createSession();
    return { client, session, mappings };
}

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

function reloadMappings() {
    mappings = JSON.parse(fs.readFileSync(config.mappingsFilePath, 'utf8'));
    return mappings;
}

module.exports = { connectOpcua, readOpcuaData, reloadMappings };
