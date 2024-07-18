# OPC UA to FIWARE IoT Agent

Este proyecto es un IoT Agent que conecta un servidor OPC UA con FIWARE Orion Context Broker.

## Configuración

1. Clona este repositorio.
2. Instala las dependencias:
    ```sh
    npm install
    ```
3. Crea un archivo `.env` basado en el archivo `.env.example` y configura tus variables de entorno.
4. Configura tus mapeos en `src/mappings.json`.

## Ejecución

Para ejecutar el IoT Agent, usa el siguiente comando:

```sh
npm start
```

Estructura del Proyecto
src/index.js: Punto de entrada del servidor IoT Agent.
src/config.js: Configuración del proyecto.
src/opcuaClient.js: Cliente OPC UA.
src/fiwareClient.js: Cliente para enviar datos a FIWARE.
src/logger.js: Configuración de logging.
src/mappings.json: Mapeos de OPC UA a FIWARE.
perl
Copiar código

#### Ejecución

Para ejecutar el IoT Agent:

```sh
npm start
```
Esto debería iniciar tu IoT Agent, conectarse al servidor OPC UA, leer los datos y enviarlos a FIWARE Orion Context Broker en intervalos de 1 segundo.