import io from 'socket.io-client'
import RTCPeerConnector from './RTCPeerConnector'

const socket = io('http://localhost:5000')

const rtc = new RTCPeerConnector(socket)
rtc.events.configPeer = (peer) => {
  const chat = peer.createDataChannel('chat')
  chat.addEventListener('open', () => {
    let randomNumber = Math.floor(Math.random() * 1000)
    console.log('Send: Hola k tal:' + randomNumber)
    chat.send('Hola k tal:' + randomNumber)
  })
  peer.addEventListener('datachannel', (event: any) => {
    const canal = event.channel
    canal.addEventListener('message', (input: any) => {
      console.log(input.data)
    })
  })
}
rtc.start()
