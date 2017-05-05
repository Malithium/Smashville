var GAMEWIDTH = 900;
var GAMEHEIGHT = 600;
var latencyFix = false;

var Logic = require("../logic");
var SearchServices = require("./searchServices");

/**
 * Update stock if player has been hit off map. Broadcast end of game is lives === 0
 * @param player - player object
 * @param socket - Socket Server used to broadcast
 */
function updateStock (player, socket) {
    var deadSession = SearchServices.sessionByID(player.id);
    if(deadSession) {
        player.stock = player.stock - 1;
        if (player.stock > 0) {
            player.percentage = 0;
            player.resetPosition();
            socket.emit("move player", {id: player.id, name: deadSession.name, x: player.getX(), y: player.getY()});
            // Let others know they've died
            socket.emit("player death", {id: player.id, name: deadSession.name});
            socket.broadcast.emit("player death", {id: player.id, name: deadSession.name});
        }
        else {
            if(deadSession.checkGameOver()) {
                // TODO: Include winner id in data
                socket.emit("sessions over", {name: deadSession.name});
                socket.broadcast.emit("sessions over", {name: deadSession.name});
            }
        }
    }
    else {
        console.log("Error session not found");
    }
}

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

    if (latencyFix) {
        if (data.x == movePlayer.getResetPositionX() && data.y == movePlayer.getResetPositionY()) {
            latencyFix = false;
        }
    }
    if (!latencyFix) {
        // Update player position
        movePlayer.setX(data.x);
        movePlayer.setY(data.y);

        // Broadcast updated position to connected socket clients
        this.broadcast.emit("move player", {
            name: moveSession.name, id: movePlayer.id, x: movePlayer.getX(),
            y: movePlayer.getY(), percentage: movePlayer.getPercentage()
        });

        if (movePlayer.getX() > GAMEWIDTH + 40 || movePlayer.getX() < -40 || movePlayer.getY() > GAMEHEIGHT + 40 || movePlayer.getY() < -40) {
            updateStock(movePlayer, this);
            latencyFix = true;
        }
    }
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

var GameServices = {
    onMovePlayer: onMovePlayer,
    onPlayerHit: onPlayerHit
};

module.exports = GameServices;