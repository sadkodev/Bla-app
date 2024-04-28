// Función que se encarga de redirigir las peticiones a los servidores correspondientes
import http_proxy from 'http-proxy';
import express from 'express';
import type { IWorkers } from '../workers/workers';
import dotenv from 'dotenv';
dotenv.config();
const HOST = process.env.hostServers || "http://localhost";
const proxy = http_proxy.createProxyServer();
/**
 * Implementa los proxies para redirigir las peticiones a los servidores correspondientes
 * @param app aplicación express
 * @param ports puertos de los servidores
 */
export default function proxies(app:express.Application, ports:IWorkers) {
    /**
     * Implementa de proxy para reaccionar a las peticiones del servidor de autenticación
     */
    app.use("/stun", (req, res) => {
        proxy.web(req, res, {
            target: `${HOST}:${ports.port_stunServer}`,
        });
    });

    /**
     * implementa de proxy para reaccionar a las peticiones del servidor react u cualquier otro framework
     */
    app.use((req, res) => {
        proxy.web(req, res, {
            target: `${HOST}:${ports.port_astroServer}`,
        });
    });
}