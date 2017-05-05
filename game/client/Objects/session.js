/**
 * Created by Kyle on 17/02/2017.
 */

/**
 * Very basic session object
 * @param id
 * @param playerCount
 * @param body
 * @param state
 */
function session(id, playerCount, body, state){
    this.id = id;
    this.body = body;
    this.playerCount = playerCount;
    this.state = state;

    this.checkGameOver = function() {

    }
}
