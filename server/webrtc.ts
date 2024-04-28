import express from 'express'
// import { handler as ssrHandler } from '../dist/server/entry.mjs'
/**
 * Aplicación Express para manejar las solicitudes HTTP.
 * @type {express.Application}
 */
const app = express()

/**
 * Puerto en el que el servidor Express escuchará las solicitudes.
 * @type {number}
 */
const PORT = 4000 || process.env.PORT

/**
 * Middleware para manejar las solicitudes HTTP en la ruta raíz.
 * @param {express.Request} req - Objeto de solicitud HTTP.
 * @param {express.Response} res - Objeto de respuesta HTTP.
 */
app.use('/', (req, res) => {
    res.send('Hello World')
})

/**
 * Iniciael servidor Express y lo hace escuchar en el puerto especificado.
 * @param {number} PORT - Puerto en el que el servidor escuchará las solicitudes.
 * @param {Function} callback - Función de devolución de llamada que se ejecutará una vez que el servidor este escuchando.
 */
app.listen(PORT, () => {
    console.log(`server running at http://localhost:${PORT}`)
})
