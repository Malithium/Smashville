// Game variables
var clients = []; // Array of connected players
var sessions = []; // Array of Sessions

function addClient(newPlayer) {
    // Add new player to array
    clients.push(newPlayer);
}

function addSession(newSession) {
    // Add new Session to array
    sessions.push(newSession);
}

function getClients() {
    return clients;
}

function getSessions() {
    return sessions;
}

// Find player by ID
function playerById (id) {
    for (var i = 0; i < clients.length; i++) {
        if (clients[i].id === id) {
            return clients[i];
        }
    }
    return false;
}

// Find session by Name
function sessionByName (name) {
    for (var i = 0; i < sessions.length; i++) {
        if (sessions[i].name === name) {
            return sessions[i];
        }
    }
    return false;
}

// Find session by Player ID
function sessionByID (id) {
    for (var i = 0; i < sessions.length; i++) {
        if (sessions[i].getPlayerById(id)) {
            return sessions[i];
        }
    }
    return false;
}

var SearchServices = {
    addClient: addClient,
    addSession: addSession,
    getClients: getClients,
    getSessions: getSessions,
    playerById: playerById,
    sessionByName: sessionByName,
    sessionByID: sessionByID
};

module.exports = SearchServices;
