import {console as toolkitConsole} from '../../libs/toolkit';
import http from 'http';
type Server = http.Server<typeof http.IncomingMessage, typeof http.ServerResponse>;
let msg = `
    Write one of the following commands: 
    - exit: to close the server
    - clear: to clear the console
>`;

export default async function menuOptions(server:Server): Promise<any>{
    let response = await toolkitConsole.input(msg);
    if (response === 'exit') {server.close(); process.exit();}
    if (response === 'clear') {toolkitConsole.clearConsole();}
    menuOptions(server);
}