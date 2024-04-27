// import WebSocket from 'ws'
// const startServer = (port: number) => {
//     let socketEvents: any = {}
//     let socketSend = (event: any, data: any, client: any) => {
//         data.event = event
//         client.send(JSON.stringify(data))
//     }
//     const ListClients: any = {}
//     const wss = new WebSocket.Server({ port })
//     console.log('iniciando servidor en puerto: ', port)
//     wss.on('connection', (client) => {
//         console.log('Se ha conectado un cliente')
//         socketEvents.offer = (data: any) => {
//             if (ListClients[data.id] === undefined) {
//                 ListClients[data.id] = {}
//             }
//             ListClients[data.id].offer = data.offer
//             ListClients[data.id].used = false
//             ListClients[data.id].socket = client
//             wss.clients.forEach((client) => {
//                 if (client.readyState === WebSocket.OPEN) {
//                     let GetUsers: any = Object.keys(ListClients).filter(
//                         (key) => {
//                             return ListClients[key].used === false
//                         }
//                     )
//                     socketSend('listUsers', { users: GetUsers }, client)
//                     socketSend('connect', { id: data.id }, client)
//                 }
//             })
//         }

//         socketEvents.answer = (data: any) => {
//             if (ListClients[data.id] === undefined) {
//                 ListClients[data.id] = {}
//             }
//             ListClients[data.id].answer = data.answer
//             ListClients[data.user].answer = data.answer
//             console.log('aplicando respuesta')
//         }

//         socketEvents.candidates = (data: any) => {
//             if (ListClients[data.id] === undefined) {
//                 ListClients[data.id] = {}
//             }
//             if (ListClients[data.id].candidates == undefined) {
//                 ListClients[data.id].candidates = []
//             }
//             ListClients[data.id].candidates.push(data.candidate)
//         }

//         socketEvents.Req_candidates = (data: any) => {
//             socketSend(
//                 'candidates',
//                 {
//                     candidates: ListClients[data.id].candidates,
//                 },
//                 client
//             )
//         }

//         socketEvents.connect = (data: any) => {
//             if (ListClients[data.id] === undefined) {
//                 ListClients[data.id] = {}
//             }
//             console.log('conectando a: ', data.id, ' con: ', data.user)

//             ListClients[data.id].used = true
//             ListClients[data.user].used = true

//             socketSend(
//                 'candidates',
//                 {
//                     candidates: ListClients[data.id].candidates,
//                 },
//                 ListClients[data.id].socket
//             )

//             socketSend(
//                 'candidates',
//                 {
//                     candidates: ListClients[data.user].candidates,
//                 },
//                 ListClients[data.id].socket
//             )

//             socketSend(
//                 'offer',
//                 {
//                     offer: ListClients[data.user].offer,
//                     user: data.user,
//                     id: data.id,
//                 },
//                 ListClients[data.user].socket
//             )
//         }

//         client.on('message', (message) => {
//             let Message = JSON.parse(message.toString())
//             let objData = { ...Message }
//             let event = Message.event
//             if (socketEvents[event]) {
//                 delete objData.event
//                 socketEvents[event](objData)
//             }
//         })

//         // ws disconnected
//         client.on('close', () => {
//             console.log('Se ha desconectado un cliente')
//         })
//     })
// }
// startServer(8181)
