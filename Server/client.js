
var Player = function (startX, startY) {
    var x = startX;
    var y = startY;
    var percentage = 0;
    var id;

    // Getters and setters
    var getX = function () {
        return x;
    };

    var getY = function () {
        return y;
    };

    var getPercentage = function () {
        return percentage;
    };

    var setX = function (newX) {
        x = newX;
    };

    var setY = function (newY) {
        y = newY;
    };

    var setPercentage = function (newPercent) {
        percentage = newPercent;
    };

    // Define which variables and methods can be accessed
    return {
        getX: getX,
        getY: getY,
        getPercentage: getPercentage,
        setX: setX,
        setY: setY,
        setPercentage: setPercentage,
        id: id
    }
};

// Export the Player class so you can use it in
// other files by using require("Player")
module.exports = Player