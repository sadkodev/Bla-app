import path from 'path';
import log from '@/libs/toolkit/console/log';
import {  Worker, parentPort  } from 'worker_threads';
import { spawn } from 'child_process';
export default async function stunServer({port=3478, username='username', password='password'}) {
    const urlPATH = path.join(__dirname, './stunServer_thread.mjs')
    const stunServer = new Worker(path.join(__dirname, './index.ts'));
    stunServer.postMessage({
        username, 
        password, 
        port,
        path:urlPATH
    });
    const response:any = await new Promise((resolve, reject) => {
        stunServer.on('message', (message) => {
            if (message.data.code ===200) {
                resolve(message);
            }
        });
    });
    log.Stun_Server({
        urls: [`turn:localhost:${response.data.port}`],
        username: response.data.username,
        credential: response.data.password
    });
    return response.data.port;
}







if (parentPort !== null) {innerWorker()}
async function innerWorker() {  // @ts-ignore
    parentPort.on('message', async (message) => { 
        try {
            const path = message.path.replace(/\\/g, '/');
            const params = [message.username, message.password, message.port];
            const child = spawn(`node ${path}`, params, { shell: true });
            child.stdout.on('data', (data) => {// @ts-ignore
                parentPort.postMessage({
                    code: "correct",
                    message: "child process has been started successfully",
                    data: JSON.parse(data.toString())
                })
            });
        } catch (error) { // @ts-ignore
            console.log(error);
        }
    })
}