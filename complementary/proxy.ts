
import http_proxy from 'http-proxy';
// recibe como parámetro objetos ( request, response ), el puerto y la url a redirection (para limpieza de url) [opcional]
// Nota: se debe controlar cuando no se implementa una url para limpiar y no aplicar la propiedad pathRewrite
export default function proxy({req, res, port, url="api"}) {
    const proxy = http_proxy.createProxyServer();
    proxy.web(req, res, {
        target: `http://localhost:${port}`,
        // changeOrigin: true,
        // pathRewrite: {
        //     [`^${url}`]: ''
        // }
    });
}