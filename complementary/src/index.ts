import {console as toolkitConsole} from './libs/toolkit';
import dotenv from 'dotenv';
import workers from './modules/workers/workers';
import express from './modules/express/express'
import proxies from './modules/proxies/proxies';
import input from './libs/toolkit/console/input';
import browser from './libs/test/browser';
import Socket from './modules/socket/Socket';
import http from 'http';
dotenv.config();
async function main(){
    toolkitConsole.clearConsole();
    const PORT = process.env.PORT || 3001;
    const portsExternalServices = await workers();
    const app = express();
    const server = http.createServer(app);
    proxies(app, portsExternalServices);
    Socket(server);
    server.listen(PORT);
    console.log(`[Main_Server]> Server is running on port http://localhost:${PORT}`);
    
    let pages = await browser(`http://localhost:${PORT}/dist/app.html`, 
    (msg,index)=>toolkitConsole.log[`Browser_${index}`](msg.text()));
    await pages(1);
    await pages(2);

    await input('Press any key to close the server');
    server.close();
    process.exit();
}
main();

