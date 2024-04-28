import { log, ReadJSON } from "./toolkit.js";
export default peerConector;

const local_Log = console.log
async function peerConector({ url = "/", name = "Juan", room = "room1" }) {
  url = String(url);
  name = String(name);
  room = String(room);
  const iceServers = await ReadJSON("/cli/iceServers.json");
  const peerClient = new RTCPeerConnection({iceServers})
  const chat = peerClient.createDataChannel('chat');
  chat.addEventListener('open', () => {
    chat.send("Hola k tal");
  });
  
  peerClient.addEventListener('datachannel', (event) => {
    const canal = event.channel;
    canal.addEventListener('message', (input) => {
      local_Log(input.data);
    })
  });

  const socket = io(url);
  socket.on("connect", () => {
    socket.emit("join", "cuarto1");
  });

  socket.on("join", (sender) => {
    if (socket.id!==sender) {
      peerClient.onicecandidate = (event) => {if (event.candidate) {
        socket.send("candidate", event.candidate, sender); 
      }};
      peerClient.createOffer().then((offer) => {
        peerClient.setLocalDescription(offer);
        socket.send("offer", offer, sender);
      });
    }
  });
  
  socket.on("answer", (answer, _, addressee) => {
    if (addressee==socket.id) {
      peerClient.setRemoteDescription(new RTCSessionDescription(answer));
    }
  });
  socket.on("candidate", (candidate, _, addressee) => {
    if (addressee==socket.id) {
      peerClient.addIceCandidate(new RTCIceCandidate(candidate));
    }
  });

  socket.on("offer", (offer, sender, addressee) => {
    if (addressee==socket.id) {
      peerClient.onicecandidate = (event) => {if (event.candidate) {
        socket.send("candidate", event.candidate, sender); 
      }};
      peerClient.setRemoteDescription(new RTCSessionDescription(offer));
      peerClient.createAnswer().then((answer) => {
        peerClient.setLocalDescription(answer);
        socket.send("answer", answer, sender);
      });
    }
  });
}