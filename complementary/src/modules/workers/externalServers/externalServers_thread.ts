// Script de control de hilos secundario react
// este se encarga de ejecutar el script de inicio del servidor react y enviar la url del servidor al servidor padre

import { spawn } from 'child_process';
import { parentPort } from 'worker_threads';
if (parentPort !== null) {parentPort.on('message', async (message) => {externalServers_thread(message);});}
async function externalServers_thread(message) {
    try {
        const child = spawn(message.path, [], { shell: true });
        child.stdout.on('data', (data) => {
            const regex = /^[a-zA-Z0-9\/\:]+$/;
            let response = data.toString().replace(regex, "")
            if (response.includes("http:") && parentPort !== null) {
                response = response.split("http:")[1].split("\n")[0];
                response = "http:" + response;
                parentPort.postMessage({
                    code: "connection success",
                    message: "child process errored",
                    data: response,
                    path: message.path
                })
            }
        });
    } catch (error) {
        if (parentPort !== null) {
            parentPort.postMessage({error})
        }
    }

}