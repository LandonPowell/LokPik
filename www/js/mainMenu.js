/* 
global
    game,
    lockSettings,
    pick,
    center
*/

var page = 0;
var itemsPerPage = Math.floor( (window.innerHeight - 60) / 100);
var buttons = [];
function changePage(pageNumber) {
    if (pageNumber <= 0) {
        game.back.alpha = 0.1;
        game.forward.alpha = 1;
        page = 0;
    }
    else if (pageNumber * itemsPerPage >= levels.length) {
        game.back.alpha = 1;
        game.forward.alpha = 0.1;
    }
    else {
        game.back.alpha = 1;
        game.forward.alpha = 1;
        page = pageNumber;
    }

    for (var x = 0; x < buttons.length; x++) {
        var currentButton = buttons[x];
        currentButton.level = x + page * itemsPerPage;
        if (currentButton.level >= levels.length) {
            currentButton.alpha = 0;
            currentButton.txt.alpha = 0;
        }
        else {
            currentButton.alpha = 1;
            currentButton.txt.alpha = 1;
            var buttonText =
                "Level " + (currentButton.level+1) + "\n" +
                levels[currentButton.level].pins.length + " Pin Lock";
            currentButton.txt.text = buttonText;
        }
    }
}

var mainMenu = {
    preload : function() {
        game.load.image('button', 'assets/menu/blankButton.png');
        game.load.image('arrow', 'assets/menu/arrow.png');
        game.stage.backgroundColor = 0x1a1a1a;
    },
    create : function() {
        console.log(this);
        for (var x = page * itemsPerPage; x < levels.length && x < itemsPerPage; x++) {
            var currentButton = game.add.button(center.w, x*100 + 5,
                'button',
                function(button) { changeLevel(button.level) }
            );
            currentButton.anchor.setTo(0.5, 0);
            currentButton.level = x;
            var buttonText =
                "Level " + (x+1) + "\n" +
                levels[x].pins.length + " Pin Lock";
            currentButton.txt = game.add.text(center.w - 50 /* + 135 */, x*100 + 15, buttonText, {
                fill: "#fff",
                align: "left",
                font: "32px Arial",
            });
            currentButton.txt.anchor.setTo(0, 0);
            buttons.push(currentButton);
        }

        game.back = game.add.button(center.w - 60, window.innerHeight - 10, 
            'arrow',
            function (button) { changePage(page - 1); });
        game.back.scale.x *= -1;
        game.back.alpha = 0.1;
        game.back.anchor.setTo(0, 1);

        game.forward = game.add.button(center.w + 60, window.innerHeight - 10, 
            'arrow',
            function (button) { changePage(page + 1); });
        game.forward.anchor.setTo(0, 1);
    },
    update : function() {
        // pass
    },
};

var levels = [
    generateLevel(1), generateLevel(2), 
    generateLevel(3), generateLevel(3),
    generateLevel(4), generateLevel(4),
    generateLevel(5), generateLevel(5)];

function generateLevel(pinCount) {
    // Generate pins
    var pins = [];
    for (var x = 0; x < pinCount; x++) {
        pins.push({
            driverLength: 2,
            keyLength: Math.floor( Math.random() * 6),
            tensionIndex: x,
        });
    }

    var shuffledPins = [];
    // Shuffle the pins
    for (var x = 0; x < pinCount; x++) {
        var index = Math.floor( Math.random() * pins.length);
        shuffledPins.push( pins[index] );
        pins.splice(index, 1);
    }

    return {
        pins: shuffledPins,
        style : 'pseudoreal',
        picks : [
            'singlePin'
        ]
    };
}

function changeLevel(lvl) {
    if (lvl == 'mainMenu') {
        return game.state.start(lvl);
    }

    var level = levels[lvl];
    lockSettings.pins = level.pins;
    lockSettings.style = level.style;
    lockSettings.pick.type = level.picks[0];
    lockSettings.level = lvl;

    return game.state.start('lockPicking');
}

game.state.add('mainMenu', mainMenu);
game.state.start('mainMenu');