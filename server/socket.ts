import http from 'http'
import { Server } from 'socket.io'
type Server_type = http.Server<
  typeof http.IncomingMessage,
  typeof http.ServerResponse
>
export default function socket(server: Server_type): any {
  const io = new Server(server, { cors: { origin: '*' } })
  io.on('connection', (socket) => {
    socket.on('join', (room) => {
      socket.join(room)
      socket.to(room).emit('join', socket.id)
    })
    socket.on('message', ({ event = 'message', data = {}, to = null }) => {
      let sendSocket =
        to !== null
          ? io.sockets.sockets.get(to) ?? socket.broadcast
          : socket.broadcast
      sendSocket.emit(event, data, socket.id)
    })
    socket.on('disconnect', () => {
      socket.broadcast.emit('leave', socket.id)
    })
    socket.on('getRoom', (room) => {
      const socketsInRoom = Array.from(io.sockets.adapter.rooms.get(room) || [])
      socket.emit('getRoom', socketsInRoom)
    })
  })
  return io
}
