import adapter from 'webrtc-adapter'
let cam_user: any
let cam_participant: any
let startButton
/**
 * This function establishes a WebSocket connection and a video call using WebRTC.
 * It also handles events such as offers, answers, and ICE candidates.
 * The requestIdleCallback function is used to execute the code when the browser has idle time to improve efficiency.
 */
requestIdleCallback(() => {
  const ws = new WebSocket('ws://localhost:8181')
  let socketEventList: any = {}
  let listUsers: any = []
  let stream = null
  let connected = false
  let socketSend = (even: any, data: any) => {
    data.event = even
    ws.send(JSON.stringify(data))
  }
  let My_ID = window.location.hash.slice(1)
  async function SelectUser(user: Array<String>) {
    let userSelected: any = ''
    let listUsers = user.reduce((acc, user, index) => {
      return acc + `${index + 1}) ${user}\n`
    }, '')
    userSelected = window.prompt('Seleccione un usuario\n' + listUsers, '1')
    userSelected = user[parseInt(userSelected) - 1]
    return userSelected
  }

  const pc = new RTCPeerConnection({
    iceServers: [
      { urls: 'stun:stun.l.google.com:19302' },
      { urls: 'stun:stun.voipstunt.com' },
      { urls: 'stun:stun.ideasip.com' },
      {
        urls: ['turn:13.250.13.83:3478?transport=udp'],
        username: 'YzYNCouZM1mhqhmseWk6',
        credential: 'YzYNCouZM1mhqhmseWk6',
      },
    ],
  })

  const browserDetails =
    adapter.browserDetails.browser + ' ' + adapter.browserDetails.version

  cam_user = document.getElementById('cam-user')
  cam_participant = document.getElementById('cam-participant')
  startButton = document.getElementById('startButton')

  if (startButton === null) {
    console.error('video element not found')
  }
  startButton?.addEventListener('click', start)

  async function start() {
    stream = await getWebcamVideo(cam_user)
    pc.onicecandidate = (event) => {
      if (event.candidate) {
        socketSend('candidates', {
          candidate: event.candidate,
          id: My_ID,
        })
      }
    }
    pc.addTrack(stream.getVideoTracks()[0], stream)
    pc.addEventListener('track', (event) => {
      const remoteStream = event.streams[0]
      cam_participant.srcObject = remoteStream
      cam_participant.play()
    })

    pc.createOffer().then((offer) => {
      console.log('creando offer')
      pc.setLocalDescription(offer)
      socketSend('offer', {
        id: My_ID,
        offer: offer,
      })
    })

    socketEventList.offer = async (message: any) => {
      pc.setRemoteDescription(new RTCSessionDescription(message.offer))
      pc.createAnswer().then((answer) => {
        pc.setLocalDescription(answer)
        socketSend('answer', {
          id: My_ID,
          user: message.user,
          answer: answer,
        })
      })
    }

    socketEventList.candidates = async (message: any) => {
      console.log('recibiendo candidates ', message.candidates)
      if (message.candidates) {
        message.candidates.forEach((candidate: any) => {
          pc.addIceCandidate(new RTCIceCandidate(candidate))
        })
      } else {
        socketSend('Req_candidates', { id: My_ID })
      }
    }

    socketEventList.answer = async (message: any) => {
      console.log('recibiendo answer')
      pc.setLocalDescription(message.answer)
    }

    socketEventList.connect = async (message: any) => {
      if (!connected) {
        connected = true
        console.log('conectando')
        let users = listUsers.filter((user: any) => user !== My_ID)
        if (users.length > 0) {
          console.log('usuario perincipal')
          let userSelected = await SelectUser(users)
          socketSend('connect', {
            id: My_ID,
            user: userSelected,
          })
        }
      }
    }
  }
  socketEventList.listUsers = async (message: any) => {
    listUsers = message.users
  }
  ws.onmessage = (message) => {
    let Message = JSON.parse(String(message.data))
    let objData = { ...Message }
    let event = Message.event
    if (socketEventList[event]) {
      delete objData.event
      socketEventList[event](objData)
    }
  }
})

async function getWebcamVideo(video1: any) {
  let stream = await navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true,
  })
  video1.srcObject = stream
  video1.muted = true
  video1.play()
  return stream
}
