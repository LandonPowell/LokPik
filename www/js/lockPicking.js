/*
global
    Phaser,
    changeLevel
*/

var center = {
    w : window.innerWidth / 2,
    h : window.innerHeight / 2 - 75,
};

var lockSettings = {
    pins : [{
        driverLength: 1,
        keyLength: 3,
        tensionIndex: 1,
    },{
        driverLength: 2,
        keyLength: 2,
        tensionIndex: 0,
    },],
    pick : {
        type : "singlePin",
    }
};

function preload() {
    game.load.audio('click', 'assets/pinClick.ogg');

    game.load.image('topPin1', 'assets/' + lockSettings.style + '/topPin/top.png');
    game.load.image('topPin2', 'assets/' + lockSettings.style + '/topPin/center.png');
    game.load.image('topPin3', 'assets/' + lockSettings.style + '/topPin/bottom.png');

    game.load.image('bottomPin1', 'assets/' + lockSettings.style + '/bottomPin/top.png');
    game.load.image('bottomPin2', 'assets/' + lockSettings.style + '/bottomPin/center.png');
    game.load.image('bottomPin3', 'assets/' + lockSettings.style + '/bottomPin/bottom.png');

    game.load.image('handle', 'assets/invisible.png');
    game.load.image('pick1', 'assets/' + lockSettings.style + '/pickSet/singlePin.png');
    game.load.image('tumbler', 'assets/' + lockSettings.style + '/tumbler.png');

    game.load.image('wrench1', 'assets/' + lockSettings.style + '/wrenchButton/tensionButton1.png');
    game.load.image('wrench2', 'assets/' + lockSettings.style + '/wrenchButton/tensionButton2.png');

    game.load.image('background', 'assets/' + lockSettings.style + '/backgrounds/1.jpg');

    game.load.image('nextLevel', 'assets/menu/blankButton.png');

    game.stage.backgroundColor = 0x998899;
}

function create() {
    // Physics startup.
    game.physics.startSystem(Phaser.Physics.ARCADE);
    game.physics.arcade.gravity.y = 400;
    this.tension = -1; // Change to -1 To-do

    this.bg = game.add.sprite(center.w, center.h, 'background');
    this.bg.anchor.setTo(0.5, 0.5);

    // Create tumbler and it's parts.
    this.tumbler = game.add.sprite(center.w, center.h, 'tumbler');
    this.tumbler.anchor.setTo(0.5, 0.5);

    this.shearLine = game.add.sprite(0, center.h - 4);
    game.physics.arcade.enable( this.shearLine );
    this.shearLine.physicsBodyType = Phaser.Physics.ARCADE;
    this.shearLine.body.allowGravity = false;
    this.shearLine.body.immovable = true;
    this.shearLine.body.setSize(window.innerWidth, 14, 0,0);

    this.floor = game.add.sprite(0, center.h + 119);
    game.physics.arcade.enable( this.floor );
    this.floor.physicsBodyType = Phaser.Physics.ARCADE;
    this.floor.body.allowGravity = false;
    this.floor.body.immovable = true;
    this.floor.body.setSize(window.innerWidth, center.h, 0,0);

    this.ceiling = game.add.sprite(0,0);
    game.physics.arcade.enable( this.ceiling );
    this.ceiling.physicsBodyType = Phaser.Physics.ARCADE;
    this.ceiling.body.allowGravity = false;
    this.ceiling.body.immovable = true;
    this.ceiling.body.setSize(window.innerWidth, center.h, 0,0);

    // Create pick.
    var pick = lockSettings.pick;
    pick.sprite = game.add.sprite(center.w, center.h + 150, 'pick1');
    pick.sprite.anchor.setTo(0.05,0);

    pick.sprite.inputEnabled = true;

    pick.sprite.physicsBodyType = Phaser.Physics.ARCADE;
    game.physics.arcade.enable(pick.sprite);
    pick.sprite.body.allowGravity = false;
    pick.sprite.body.setSize(4,20, 12,0);
    pick.sprite.body.mass = 0.01;
    pick.sprite.body.collideWorldBounds = true;

    pick.handle = game.add.sprite(center.w, center.h + 150, 'handle');
    pick.handle.scale.setTo(10,1);
    pick.handle.anchor.setTo(0.05,0);
    pick.handle.inputEnabled = true;
    pick.handle.input.enableDrag();

    // Create tension wrench button.
    this.wrench = game.add.button(center.w, center.h + 275, 'wrench1');
    this.wrench.anchor.setTo(0.5, 0.5);

    this.wrench.events.onInputDown.add(function() {
        this.wrench.loadTexture('wrench2');

        this.tension = 0;
    }, this);

    this.wrench.events.onInputUp.add(function() {
        this.wrench.loadTexture('wrench1');

        this.tension = -1;
        for (var x = 0; x < lockSettings.pins.length; x++) {
            var pin = lockSettings.pins[x];
            pin.key.body.moves = true;
            pin.driver.body.moves = true;
        }
    }, this);

    for (var x = 0; x < lockSettings.pins.length; x++) {
        var pin = lockSettings.pins[x];

        var horizontalPos = center.w - 150 + 60*x;
        var verticalPos = center.h - pin.driverLength * 15 - pin.keyLength * 15 + 60;

        // Upper half of pin.
        pin.driver = game.add.sprite(horizontalPos, verticalPos);
        game.physics.arcade.enable( pin.driver );
        pin.driver.physicsBodyType = Phaser.Physics.ARCADE;

        pin.driver.addChild(game.make.sprite(0, 0, 'topPin1'));
        for (var y = 1; y <= pin.driverLength; y++) {
            pin.driver.addChild(game.make.sprite(0, y * 15, 'topPin2'));
        }
        pin.driver.addChild(game.make.sprite(0, 15 + 15*pin.driverLength, 'topPin3'));
        pin.driver.body.setSize(30, 30 + 15*pin.driverLength, 0,0);
        pin.driver.body.mass = 0.01;
        pin.driver.body.collideWorldBounds = true;

        // Lower half of pin.
        pin.key = game.add.sprite(horizontalPos, verticalPos + pin.driverLength*15 + 30);
        game.physics.arcade.enable( pin.key );
        pin.key.physicsBodyType = Phaser.Physics.ARCADE;

        pin.key.addChild(game.make.sprite(0, 0, 'bottomPin1'));
        for (var y = 1; y <= pin.keyLength; y++) {
            pin.key.addChild(game.make.sprite(0, y * 15, 'bottomPin2'));
        }
        pin.key.addChild(game.make.sprite(0, 15 + 15*pin.keyLength, 'bottomPin3'));
        pin.key.body.setSize(30, 30 + 15*pin.keyLength, 0,0);
        pin.key.body.mass = 0.01;
    }

    // Create audio.
    this.click = game.add.audio('click');

    // Create menu.
    this.nextLevel = game.add.button(center.w, center.h, 
        'nextLevel',
        function(button) { changeLevel(lockSettings.level + 1) }
    );
    this.nextLevel.alpha = 0;
    this.nextLevel.anchor.setTo(0.5, 0.5);
    this.nextLevel.visible = false;

    var buttonText = "Level " + (lockSettings.level+2);
    this.nextLevel.txt = game.add.text(center.w - 50, center.h - 25, buttonText, {
        fill: "#fff", 
        align: "left",
        font: "45px Arial",
    });
    this.nextLevel.txt.alpha = 0;
    this.nextLevel.txt.anchor.setTo(0, 0);
}

function update() {
    var pick = lockSettings.pick;
    game.physics.arcade.collide(this.ceiling, pick.sprite);

    game.physics.arcade.moveToObject(pick.sprite, pick.handle, 1, 30);

    if (!pick.handle.input.isDragged) {
        pick.handle.position.x = pick.sprite.position.x;
        pick.handle.position.y = pick.sprite.position.y;
        // Fun-fact: Because of JavaScript's OOP bullshit,
        // setting position = position fucks everything up, lol.
    }

    for (var x = 0; x < lockSettings.pins.length; x++) {
        var pin = lockSettings.pins[x];
        game.physics.arcade.collide(pin.key, this.floor);

        // This block is how I make the pick work properly in several ways. 
        // "Collide" alone is simply not enough, as it makes things shoot around like nuts and contacts on the top and sides.
        game.physics.arcade.overlap(pick.sprite, pin.key, function() {
            pin.driver.body.velocity.y = 0;
            pin.key.body.velocity.y = 0;

            var bottom = Math.min( pick.sprite.position.y, center.h + 119);

            pin.key.position.y = bottom - pin.key.body.height;
            if (pin.driver.body.bottom > pin.key.position.y) {
                pin.driver.position.y = pin.key.position.y - pin.driver.body.height;
            }
        });

        game.physics.arcade.collide(pin.driver, pin.key);
        pin.status = pinSet(pin.tensionIndex, this.shearLine, pin, this.click, this);

        if (pin.status) {
            pin.driver.body.moves = false;
            if (pin.status == "overset") {
                pin.key.body.moves = false;
            }
        }
        else if (this.tension < 0) { // Tension released
            pin.driver.body.moves = true;
            pin.key.body.moves = true;
            pin.status = false;
        }

        if (gameWin(lockSettings.pins)) {
            this.nextLevel.visible = true;
            game.add.tween(this.nextLevel).to({ alpha: 1 }, 500, 'Linear', true, 0);
            game.add.tween(this.nextLevel.txt).to({ alpha: 1 }, 500, 'Linear', true, 0);
        }
    }
}

function pinSet(pinTension, shearLine, pin, click, world) {
    /*
    This is kind of silly, but it does exactly what I 
    want it to do, and does it pretty well.
    */
    if (world.tension < pinTension) {
        return false;
    }

    var a = pin.driver.body;
    var b = pin.key.body;
    var s = shearLine.body;

    if (pin.status == "set") {
        return "set";
    }
    else if (s.bottom > a.bottom) {
        if (s.y < b.y) {
            if (pin.status != "set") { // If this is the first frame where this pin is set, do the startup shit.
                click.play();
                world.tension += 1;
            }
            return "set";
        }
        return "overset";
    }
    else if (s.y >= b.y) {
        return "overset";
    }
    else if (world.tension != pinTension) {
        // Not enough tension to set.
        return false;
    }
}

function gameWin(pins) {
    for (var x = 0; x < pins.length; x++)
        if (pins[x].status != "set") return false;
    return true;
}

var game = new Phaser.Game(window.innerWidth, window.innerHeight, Phaser.AUsTO);

game.state.add('lockPicking', {
    preload : preload,
    create : create,
    update : update,
});

/*
    CORDOVA EXCLUSIVE BULLSHIT
*/

var app = {
    // Application Constructor
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },

    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    onDeviceReady: function() {
        this.receivedEvent('deviceready');
    },

    // Update DOM on a Received Event
    receivedEvent: function(id) {
        console.log('Received Event: ' + id);
    }
};

app.initialize();