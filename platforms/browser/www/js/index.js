/*
global
    Phaser
*/

var center = {
    w : window.innerWidth / 2,
    h : window.innerHeight / 2,
};

var lockSettings = {
    pins : [{
        topLength: 1,
        bottomLength: 3,
        tensionIndex: 0,
    },{
        topLength: 1,
        bottomLength: 2,
        tensionIndex: 1,
    },]
};

var pick = {
    type : "singlePin",
};

var gameState = {
    preload: function() {
        this.game.load.image('topPin1', 'assets/minimal/topPin/top.png');
        this.game.load.image('topPin2', 'assets/minimal/topPin/center.png');
        this.game.load.image('topPin3', 'assets/minimal/topPin/bottom.png');

        this.game.load.image('bottomPin1', 'assets/minimal/bottomPin/top.png');
        this.game.load.image('bottomPin2', 'assets/minimal/bottomPin/center.png');
        this.game.load.image('bottomPin3', 'assets/minimal/bottomPin/bottom.png');

        this.game.load.image('pick1', 'assets/minimal/pickSet/singlePin.png');
        this.game.load.image('tumbler', 'assets/minimal/tumbler.png');

        this.game.stage.backgroundColor = 0x998899;
    },

    create: function() {
        // Physics startup.
        this.game.physics.startSystem(Phaser.Physics.ARCADE);
        this.game.physics.arcade.gravity.y = 98;

        // Create tumbler with shear line as background.
        this.tumbler = this.game.add.sprite(center.w, center.h, 'tumbler');
        this.tumbler.anchor.setTo(0.5, 0.5);

        this.floor = this.game.add.sprite(0, center.h + 100);
        this.game.physics.arcade.enable( this.floor );
        this.floor.physicsBodyType = Phaser.Physics.ARCADE;
        this.floor.body.allowGravity = false;
        this.floor.body.immovable = true;
        this.floor.body.setSize(window.innerWidth, center.h, 0,0);

        // Create pick.
        pick.sprite = this.game.add.sprite(center.w, center.h + 150, 'pick1');
        pick.sprite.anchor.setTo(0.05,0);

        pick.sprite.inputEnabled = true;
        pick.sprite.input.enableDrag();

        pick.sprite.physicsBodyType = Phaser.Physics.ARCADE;
        this.game.physics.arcade.enable(pick.sprite);
        pick.sprite.body.allowGravity = false;
        pick.sprite.body.immovable = true;
        pick.sprite.body.setSize(30,30, 0,0);

        for (var x = 0; x < lockSettings.pins.length; x++) {
            var pin = lockSettings.pins[x];

            // Upper half of pin.
            pin.upper = this.game.add.sprite(center.w, center.h);
            this.game.physics.arcade.enable( pin.upper );
            pin.upper.physicsBodyType = Phaser.Physics.ARCADE;

            pin.upper.addChild(this.game.make.sprite(0, 0, 'topPin1'));
            for (var y = 1; y <= pin.topLength; y++) {
                pin.upper.addChild(this.game.make.sprite(0, y * 15, 'topPin2'));
            }
            pin.upper.addChild(this.game.make.sprite(0, 15 + 15*pin.topLength, 'topPin3'));
            pin.upper.body.setSize(30, 30 + 15*pin.topLength, 0,0);

            // Lower half of pin.
            pin.lower = this.game.add.sprite(center.w, center.h + pin.topLength*15 + 30);
            this.game.physics.arcade.enable( pin.lower );
            pin.lower.physicsBodyType = Phaser.Physics.ARCADE;

            pin.lower.addChild(this.game.make.sprite(0, 0, 'bottomPin1'));
            for (var y = 1; y <= pin.bottomLength; y++) {
                pin.lower.addChild(this.game.make.sprite(0, y * 15, 'bottomPin2'));
            }
            pin.lower.addChild(this.game.make.sprite(0, 15 + 15*pin.bottomLength, 'bottomPin3'));
            pin.lower.body.setSize(30, 30 + 15*pin.bottomLength, 0,0);
        }
    },

    update: function() {
        for (var x = 0; x < lockSettings.pins.length; x++) {
            var pin = lockSettings.pins[x];
            this.game.physics.arcade.collide(pick.sprite, pin.lower);
            this.game.physics.arcade.collide(pin.upper, pin.lower);
            this.game.physics.arcade.collide(pin.lower, this.floor);
        }
    },
};

var game = new Phaser.Game(window.innerWidth, window.innerHeight, Phaser.AUTO);

game.state.add('gameState', gameState);
game.state.start('gameState');

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