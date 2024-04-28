import externalServers from "./externalServers";
import stunServer from "./stunServer";
import path from 'path';
export interface IWorkers {
    port_stunServer?: number;
    port_reactServer?: number;
    port_astroServer?: number;
}
export default async function workers(): Promise<IWorkers>{
    const urls = {
        reactServer: path.join(__dirname, '../../../../reactserver/start.bat'),
        astroServer: path.join(__dirname, '../../../../astroServer/start.bat')
    }
    const ports:IWorkers = {
        port_stunServer: await stunServer({}), 
        port_reactServer:await externalServers(urls.reactServer, 'reactServer'),
        port_astroServer:await externalServers(urls.astroServer, 'astroServer')
    };
    return ports;
}
