// Last Updated: 20/01/2017

function Message(sender, text) {
    this.sender = sender;
    this.text = sender.name + ': ' + text;
}

module.exports = Message;