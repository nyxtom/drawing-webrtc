const wsConnection = new WebSocket('ws:127.0.0.1:8081', 'json');
var localId;
var peerIds;
var peerConnections = {};
var initiator = false;

wsConnection.onopen = (e) => {
    console.log(`wsConnection open to 127.0.0.1:8081`, e);
};

wsConnection.onerror = (e) => {
    console.error(`wsConnection error `, e);
};

wsConnection.onmessage = (e) => {
    let data = JSON.parse(e.data);
    switch (data.type) {
        case 'connection':
            localId = data.id;
            break;
        case 'ids':
            peerIds = data.ids;
            connect();
            break;
        case 'signal':
            signal(data.id, data.data);
            break;
    }
};

function broadcast(data) {
    Object.values(peerConnections).forEach(peer => {
        try {
            peer.send(data);
        } catch (e) {
        }
    });
}

function signal(id, data) {
    if (peerConnections[id]) {
        peerConnections[id].signal(data);
    }
}

function connect() {
    // remove peer connections not in peer ids
    Object.keys(peerConnections).forEach(id => {
        if (!peerIds.includes(id)) {
            peerConnections[id].destroy();
            delete peerConnections[id];
        }
    });
    if (peerIds.length === 1) {
        initiator = true;
    }
    peerIds.forEach(id => {
        if (id === localId) {
            return;
        }

        if (peerConnections[id]) {
            return;
        }
        let peer = new SimplePeer({
            initiator: initiator
        });

        peer.on('error', console.error);
        peer.on('signal', data => {
            wsConnection.send(JSON.stringify({
                type: 'signal',
                id: localId,
                data
            }));
        });
        peer.on('connect', () => {
            console.log(`${localId} now connected to ${id}`);
        });

        peer.on('data', (data) => {
            onPeerData(id, data);
        });

        peerConnections[id] = peer;
    });
}
