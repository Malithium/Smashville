/**
 * Created by Kyle Tuckey on 12/02/2017.
 */

var errorLabel;

/**
 * Asks user for name. Then progresses to local Menu state
 * @type {{create: userState.create, evaluateName: userState.evaluateName}}
 */
var userState = {
    create: function() {
        titleLabel = game.add.text(10, 10, "Welcome to SmashVille!", {font:"30px Arial", fill:"#ffffff"});
        nameLabel = game.add.text(GAMEWIDTH/2 - 110, 160, "Please input your name", { font: "21px Arial", fill: "#ffffff"});
        errorLabel = game.add.text(GAMEWIDTH/2 - 250, GAMEHEIGHT - 60, "", { font: "30px Arial", fill: "#ff0000"});
        var u = document.getElementById("user-overlay");
        u.style.left = GAMEWIDTH/2 - u.offsetWidth/2;
        u.style.top = GAMEHEIGHT/2 - u.offsetHeight/2;

        var t = document.getElementById("user-text");
        t.style.marginLeft = u.offsetWidth/2 - t.offsetWidth/2;
        t.style.marginTop = u.offsetHeight/4 - t.offsetHeight/4;

        var b = document.getElementById("user-button");
        b.style.marginLeft = u.offsetWidth/2 - b.offsetWidth/2;
        b.style.marginTop = 10+"px";
    },

    /**
    * This method takes the value of the textbox in the HTML, and validates it, before storing it in our application it hides the display after it has been used.
    */
    evaluateName: function () {
        var error = false;
        var errorMsg = "";
        var t = document.getElementsByName("username")[0].value;

        if(t.toString() === "") {
            error = true;
            errorMsg = "Textbox is empty! please input a name";
        }

        if(t.toString().length > 12 && error === false) {
            error = true;
            errorMsg = "Name must be less than 12 characters"
        }

        if(error === false) {
            playerName = t.toString();
            var u = document.getElementById("user-overlay").style.display = "none";
            game.state.start("menu");
        }
        else {
            errorLabel.setText(errorMsg);
        }

    }
};