const iceServers = [
  { urls: 'stun:stun.l.google.com:19302' },
  { urls: 'stun:stun1.l.google.com:19302' },
  { urls: 'stun:stun2.l.google.com:19302' },
  { urls: 'stun:stun3.l.google.com:19302' },
  { urls: 'stun:stun4.l.google.com:19302' },
  { urls: 'stun:stun.voipstunt.com' },
  { urls: 'stun:stun.ideasip.com' },
  {
    urls: ['turn:13.250.13.83:3478?transport=udp'],
    username: 'YzYNCouZM1mhqhmseWk6',
    credential: 'YzYNCouZM1mhqhmseWk6',
  },
]

export default iceServers
