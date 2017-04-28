var GAMEWIDTH = 900;
var GAMEHEIGHT = 600;

var Logic = require("../logic");
var SearchServices = require("./searchServices");

/**
 * Player has moved
 * @param data - Pass across playerID
 */
function onMovePlayer (data) {
    // Find player in array
    var movePlayer = SearchServices.playerById(this.id);

    // Player not found
    if (!movePlayer) {
        console.log("Player not found: " + this.id);
        return false;
    }

    var moveSession = SearchServices.sessionByID(this.id);

    // Session not found
    if (!moveSession) {
        console.log("Session not found with player: " + this.id);
        return false;
    }

    // TODO: Insert Latency Compensation (Check diff then react accordingly)
    // Update player position
    movePlayer.setX(data.x);
    movePlayer.setY(data.y);

    if(movePlayer.getX() > GAMEWIDTH+40 || movePlayer.getX() < -40 || movePlayer.getY() > GAMEHEIGHT+40 || movePlayer.getY() < -40) {
        updateStock(movePlayer, this);
    }

    // Broadcast updated position to connected socket clients
    this.broadcast.emit("move player", {name: moveSession.name, id: movePlayer.id, x: movePlayer.getX(),
        y: movePlayer.getY(), percentage: movePlayer.getPercentage()});
}

/**
 * Check if player has been hit. Return hit players ID if true
 * @param data - Pass across playerID
 */
function onPlayerHit(data) {
    var hitSession = SearchServices.sessionByID(this.id);
    var hitPlayer = Logic.checkCollision(SearchServices.playerById(this.id), hitSession.players);
    if(hitPlayer) {
        hitPlayer.setPercentage(Logic.registerDamage(hitPlayer.getPercentage(), data.dmg));
        var knockback = Logic.calculateKnockback(hitPlayer.getPercentage(), data.dmg);
        var dir = 0;
        var up = 0;

        if (data.action < 3) {
            dir = data.action;
        } else {
            up = (data.action - 2);
        }

        this.emit("hit player", {name: hitSession.name, id: hitPlayer.id,
            percent: hitPlayer.getPercentage(),
            knockback: knockback, dir: dir, up: up});

        this.broadcast.emit("hit player", {name: hitSession.name, id: hitPlayer.id,
            percent: hitPlayer.getPercentage(),
            knockback: knockback, dir: dir, up: up});
    }
}

/**
 * Update stock if player has been hit off map. Broadcast end of game is lives === 0
 * @param player - player object
 * @param socket - Socket Server used to broadcast
 */
function updateStock (player, socket) {
    var deadSession = SearchServices.sessionByID(player.id);
    if(deadSession) {
        if (player.stock > 0) {
            player.resetPosition();
            player.percentage = 0;
            socket.emit("move player", {id: player.id, name: deadSession.name, x: player.getX(), y: player.getY()});
        }
        else {
            if(deadSession.checkGameOver()) {
                // TODO: Include winner id in data
                socket.emit("sessions over", {name: deadSession.name});
                socket.broadcast.emit("sessions over", {name: deadSession.name});
            }
            else
            {
                socket.emit("player death", {id: player.id, name: deadSession.name});
                socket.broadcast.emit("player death", {id: player.id, name: deadSession.name});
            }
        }
        player.stock = player.stock - 1;
    }
    else {
        console.log("Error session not found");
    }
}

var GameServices = {
    onMovePlayer: onMovePlayer,
    onPlayerHit: onPlayerHit
};

module.exports = GameServices;