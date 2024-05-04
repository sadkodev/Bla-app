import iceServers from './iceServers.js'
export default function RTCPeerConnector(socket) {
  const eventNames = {
    offer: 'offer',
    answer: 'answer',
    candidate: 'candidate',
    join: 'join',
  }
  this.peerClients = {}
  this.events = {
    connect: () => {},
    join: (client) => {},
    leave: (id) => {},
    configPeer: (peerClient, client) => {},
  }
  const createPeerClient = (client, socket) => {
    const peerClient = new RTCPeerConnection({ iceServers })
    this.events.configPeer(peerClient, client)
    peerClient.onicecandidate = (event) => {
      if (event.candidate) {
        socket.send({
          event: eventNames.candidate,
          data: event.candidate,
          to: client,
        })
      }
    }
    return peerClient
  }

  this.start = async () => {
    socket.on('connect', () => {
      this.events.connect()
      socket.emit(eventNames.join, room)
    })
    socket.on(eventNames.join, (client) => {
      this.events.join(client)
      this.peerClients[client] = createPeerClient(client, socket)
      this.peerClients[client].createOffer().then((offer) => {
        this.peerClients[client].setLocalDescription(offer)
        socket.send({
          event: eventNames.offer,
          data: offer,
          to: client,
        })
      })
    })
    socket.on(eventNames.offer, (offer, sender) => {
      this.peerClients[sender] = createPeerClient(sender, socket)
      this.peerClients[sender].setRemoteDescription(
        new RTCSessionDescription(offer)
      )
      this.peerClients[sender].createAnswer().then((answer) => {
        this.peerClients[sender].setLocalDescription(answer)
        socket.send({
          event: eventNames.answer,
          data: answer,
          to: sender,
        })
      })
    })

    socket.on(eventNames.answer, (answer, sender) => {
      this.peerClients[sender].setRemoteDescription(
        new RTCSessionDescription(answer)
      )
    })

    socket.on(eventNames.candidate, (candidate, sender) => {
      this.peerClients[sender].addIceCandidate(new RTCIceCandidate(candidate))
    })
    socket.on('leave', (id) => {
      this.events.leave(id)
      this.peerClients[id].close()
      delete this.peerClients[id]
    })
  }
}
