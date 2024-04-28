import path from 'path';
import express from 'express';
export default function App():express.Application {
    const app = express()
    app.use(express.urlencoded({ extended: true }));
    app.get('/api', (req, res) => {
        res.send('Hello World');
    });

    app.use("/dist", express.static(path.join(__dirname, '../../../dist/')));
    app.use("/cli", express.static(path.join(__dirname, '../../client/')));
    
    // app.use(modRewrite([
    //     '!\\.\\w+$ /index.html [L]'  // Redirigir todas las rutas sin extensión a /index.html
    // ]));
    // app.get('*', (req, res) => {
    //     res.sendFile(path.join(__dirname, '../../../dist/index.html'));
    // });
    return app;
}