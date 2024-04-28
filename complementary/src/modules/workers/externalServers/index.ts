import path from 'path';
import log from '@/libs/toolkit/console/log';
import { Worker } from 'worker_threads';   
/*  Inicialización de servidores externos
    envía el path del archivo script correspondiente al de inicio del servidor react, el cual manejara la lógica de la aplicación
    se envía la ruta del archivo script para que el hilo secundario pueda ejecutarlo
    Nota: se debe controlar la ruta del archivo script
    Nota: este scrip secundario en las instrucciones solo se encarga de controlar la ejecución interna del proyecto de react 
*/ 
export default async function externalServers(url: string, nameServer: string) {
    const ofterServers = new Worker(path.join(__dirname, './externalServers_thread.ts'));
    ofterServers.postMessage({
        path: url
    });
    const response:any = await new Promise((resolve, reject) => {
        ofterServers.on('message', (message) => {
            resolve(message);
        });
    });
    const data = String(response.data).trim();   
    let port:any = data.split('//')[1].split("/")[0];
    port = port.replaceAll("\n", "").replaceAll("\r", "");
    if (port.includes("1m") && port.includes("22m")) {
        port = port.split("1m")[1].split("22m")[0];
    }
    const Num = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"]
    let validNumbers:any = []
    String(port).split("").forEach((element) => {
        if (Num.includes(element)) {
            validNumbers.push(element)
        }
    })
    port = Number(validNumbers.join(""));
    log[nameServer](`http://localhost:${port}`);
    return port
}