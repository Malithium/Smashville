// Last Updated: 20/01/2017

function Message(id, text) {
    this.id = id;
    this.text = text;

    this.getText = function() {
        return this.text;
    };

    this.getId = function() {
        return this.id;
    };
}

module.exports = Message;