function init() {
    var platforms;
    var player;
    var keyClicked;
    var jumpHeight = 0
    // configuration to create scene
    var config = {
        type: Phaser.AUTO,
        width: 800,
        height: 600,
        physics: {
            default: 'arcade',
            gravity: { y: 300 },
            debug: false
        },
        scene: {
            preload: preload,
            create: create,
            update: update
        }
    };

    function preload() {
        this.load.image('sky', '../../assets/images/sky.png');
        this.load.image('platform', '../../assets/images/platform.png');
        this.load.image('star', '../../assets/images/star.png');
        this.load.image('bomb', '../../assets/images/bomb.png');
        this.load.spritesheet('jack', '../../assets/images/jack.png', { frameWidth: 32, frameHeight: 48 });
    }

    function create() {
        //Sky background
        this.add.image(0, 0, 'sky').setOrigin(0, 0); //or use image(400, 300, 'sky') without setorigin
        // this.add.image(400, 300, 'star');

        //Platform
        platforms = this.physics.add.staticGroup();
        platforms.create(400, 568, 'platform').setScale(2).refreshBody(); // The call to refreshBody() is required because we have scaled a static physics body, so we have to tell the physics world about the changes we made.
        platforms.create(600, 400, 'platform');
        platforms.create(50, 250, 'platform');
        platforms.create(750, 220, 'platform');

        //Jack
        player = this.physics.add.sprite(100, 400, 'jack');
        player.setBounce(0.2);
        player.setCollideWorldBounds(true);
        player.body.setGravityY(300);

        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('jack', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'turn',
            frames: [{ key: 'jack', frame: 4 }],
            frameRate: 20
        });

        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('jack', { start: 5, end: 8 }),
            frameRate: 10,
            repeat: -1
        });

        this.physics.add.collider(player, platforms);

        //keyboard events
        keyClicked = this.input.keyboard.createCursorKeys();
    }

    function update() {

        if (keyClicked.left.isDown) {
            // console.log('Go left');
            player.setVelocityX(-100);
            player.anims.play('left', true); //add animation for left movement
        } else if (keyClicked.right.isDown) {
            // console.log('Go right');
            player.setVelocityX(100);
            player.anims.play('right', true); //add animation for right movement
        } else {
            // console.log('stop');
            player.setVelocityX(0);
            player.anims.play('turn'); //to stop and face camera
        }

        if (keyClicked.space.isDown /*&& player.body.touching.down*/) {
            jumpHeight++;
            console.log('jump', jumpHeight);
            if (jumpHeight <= 25) {
                player.setVelocityY(-250);
            }
            if (player.body.touching.down) {
                jumpHeight = 0;
                /**
                 * use jumpHeight to create jet pack value
                 */
            }
        }
    }

    var game = new Phaser.Game(config);
}

$(document).ready(function () {
    // $div = $('<div></div>').addClass('asdasd').appendTo('body');
    // alert("window is loaded");
    init();
});