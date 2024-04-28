// iniciamos el servidor STUN/TURN en un worker thread
// este se encarga de descubrir la dirección IP y el puerto de un cliente, y de abrir un puerto en el servidor para que el cliente pueda conectarse
import Turn from 'node-turn';
let server; // Declara server como any para evitar errores de tipos
async function main() {
  console.log(JSON.stringify({
    status:"info",
    code:100,
    msg:"Starting STUN/TURN server"
  }));
  const username = (process.argv.length-1)>=2?process.argv[2]:"username";
  const password = (process.argv.length-1)>=3?process.argv[3]:"password";
  const port = (process.argv.length-1)>=4?parseInt(process.argv[4]):3478;
  server = new Turn({
    authMech: 'long-term',
    credentials: { [username]: password },
    debugLevel: 'TURN',
    listeningPort: port
  });
  await server.start();
  console.log(JSON.stringify({
    username,
    password,
    status:"success",
    msg:`STUN/TURN server started on port ${port}`, 
    code:200,
    port
  }));
}
main();