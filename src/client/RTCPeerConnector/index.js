async function ReadJSON(URL) {
    const response = await fetch(URL);
    if (!response.ok) {throw new Error(`HTTP error! status: ${response.status} =>  ${URL}`);}
    return await response.json();
}

export default function RTCPeerConnector({
            iceServers="./RTCPeerConnector/iceServers.json", 
            PathIO="./socket.io.esm.min.js", 
            UrlSocket="/",
            room="default"
        }) {
    const eventNames = {
        offer: "offer",
        answer: "answer",
        candidate: "candidate",
        join: "join",
    }
    let IceServers = null;
    this.peerClients = {};
    this.LocalEvents = {
        connect:()=>{},
        join:(client)=>{},
        leave:(id)=>{},
        configPeer:(peerClient, client)=>{},
        configClose:()=>{},
    };
    const createPeerClient = (client, socket) => {
        const peerClient = new RTCPeerConnection({iceServers:IceServers})
        this.LocalEvents.configPeer(peerClient, client);
        peerClient.onicecandidate = (event) => {if (event.candidate) {
            socket.send({
                event:eventNames.candidate, 
                data:event.candidate, 
                to:client
            }); 
        }};
        return peerClient;
    };

    this.socket = null;
    this.start = async ()=>{
        IceServers = await ReadJSON(iceServers);
        if (this.socket === null) {
            const io = (await import(PathIO)).default;
            this.socket = io(UrlSocket);
        }
        this.socket.on("connect", () => {
            this.LocalEvents.connect();
            this.socket.emit(eventNames.join, room);
        });
        this.socket.on(eventNames.join, (client) => {
            this.LocalEvents.join(client);
            this.peerClients[client] = createPeerClient(client, this.socket);
            this.peerClients[client].createOffer().then((offer) => {
                this.peerClients[client].setLocalDescription(offer);
                this.socket.send({
                    event:eventNames.offer, 
                    data:offer, 
                    to:client
                });
            });
        });
        this.socket.on(eventNames.offer, (offer, sender) => {
            this.peerClients[sender] = createPeerClient(sender, this.socket);
            this.peerClients[sender].setRemoteDescription(new RTCSessionDescription(offer));
            this.peerClients[sender].createAnswer().then((answer) => {
                this.peerClients[sender].setLocalDescription(answer);
                this.socket.send({
                    event:eventNames.answer, 
                    data:answer, 
                    to:sender
                });
            });
        });

        this.socket.on(eventNames.answer, (answer, sender) => {
            this.peerClients[sender].setRemoteDescription(new RTCSessionDescription(answer));
        });

        this.socket.on(eventNames.candidate, (candidate, sender) => {
            this.peerClients[sender].addIceCandidate(new RTCIceCandidate(candidate));
        });

        this.socket.on("leave", (id) => {
            this.LocalEvents.leave(id);
            this.peerClients[id].close();
            delete this.peerClients[id];
        });
        
        return this.socket;
    }
    this.close = ()=>{
        this.LocalEvents.configClose();
        this.socket.close();
    };
}