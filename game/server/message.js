// Last Updated: 20/01/2017

function Message(id, text) {
    var text = text;
    var id = id;

    return {
        getText: text,
        getId: id
    };
}


module.exports = Message;