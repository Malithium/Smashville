/**
 * Basic Client object.
 * @param name
 * @constructor
 */
function Client(name) {
    this.id;
    this.x = 0;
    this.y = 0;
    this.name = name;
    this.lobbyID = 0;
    this.percentage = 0;
    this.characterID = 0;
    this.stock = 3;

    // Getters and setters
    this.getX = function () {
        return this.x;
    };

    this.getY = function () {
        return this.y;
    };

    this.getName = function () {
        return this.name;
    };

    this.getPercentage = function () {
        return this.percentage;
    };

    this.setX = function (newX) {
        this.x = newX;
    };

    this.setY = function (newY) {
        this.y = newY;
    };

    this.setLobbyID = function(newID) {
        this.lobbyID = newID;
    };

    this.setPercentage = function (newPercent) {
        this.percentage = newPercent;
    };

    this.getStock = function () {
        return this.stock;
    };

    this.setStock = function(stock) {
        this.stock = stock;
    };

    this.resetPosition = function() {
        this.x = 800/2;
        this.y = 600/2;
    };

    this.getResetPositionX = function() {
        return 800/2;
    };

    this.getResetPositionY = function() {
        return 600/2;
    };
}

// Export the Player class so you can use it in
// other files by using require("Player")
module.exports = Client;