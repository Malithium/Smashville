
function Client(name) {
    this.id;
    this.x = 0;
    this.y = 0;
    this.name = name;
    this.percentage = 0;
    this.characterID = 0;

    // Getters and setters
    this.getX = function () {
        return this.x;
    };

    this.getY = function () {
        return this.y;
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

    this.setPercentage = function (newPercent) {
        this.percentage = newPercent;
    };
}

// Export the Player class so you can use it in
// other files by using require("Player")
module.exports = Client;