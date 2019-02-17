function init() {
    var platforms;
    var player;
    var stars;
    var bombs;
    var keyClicked;
    var playbackMusic;
    var jumpSound;
    var explodeSound;
    var starCollectSound;
    var jumpHeight = 0;
    var score = 0;
    var scoreText;
    var gameOverText;
    var gameOver = false;
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
        /**
         * Loading audio
         */

        this.load.audio('despacito', '../../../../assets/audio/playback/despacito.mp3');
        this.load.audio('jump', '../../../../assets/audio/misc/jump.wav');
        this.load.audio('explode', '../../../../assets/audio/misc/Explosion.mp3');
        this.load.audio('collectStar', '../../../../assets/audio/misc/starCollect.mp3');

        // this.sound.setDecodedCallback([jumpSound], this);

        /**
         * Loading Images
         */
        this.load.image('sky', '../../assets/images/sky.png');
        // this.load.image('wall', '../../assets/images/wall4_1.jpg');
        this.load.image('platform', '../../assets/images/platform.png');
        this.load.image('star', '../../assets/images/star.png');
        this.load.image('bomb', '../../assets/images/bomb.png');
        this.load.spritesheet('jack', '../../assets/images/jack.png', { frameWidth: 32, frameHeight: 48 });
    }

    function create() {
        //Sky background
        this.add.image(0, 0, 'sky')/*.setScale(0.5)*/.setOrigin(0, 0); //or use image(400, 300, 'sky') without setorigin
        // this.add.image(400, 300, 'star');

        //Platform
        platforms = this.physics.add.staticGroup();
        platforms.create(400, 568, 'platform').setScale(2).refreshBody(); // The call to refreshBody() is required because we have scaled a static physics body, so we have to tell the physics world about the changes we made.
        platforms.create(600, 400, 'platform');
        platforms.create(50, 250, 'platform');
        platforms.create(750, 220, 'platform');
        platforms.create(400, 120, 'platform').setScale(0.3, 1).refreshBody();

        //Jack
        player = this.physics.add.sprite(100, 400, 'jack');
        player.setBounce(0.2);
        player.setCollideWorldBounds(true);
        player.body.setGravityY(300);

        //Star
        stars = this.physics.add.group({
            key: 'star',
            repeat: 11,
            setXY: { x: 12, y: 0, stepX: 70 }
        });

        stars.children.iterate(function (child) {
            // console.log(Phaser.Math.FloatBetween(0.4, 0.8));
            child.setBounceY(Phaser.Math.FloatBetween(0.2, 0.5)); //Add bounce to stars
            child.body.setGravityY(Math.floor((Math.random() * 10) + 1)); // Adding gravity to the stars or else they would sit at the top
            child.body.setVelocityY(50); //Falling stars velocity
        });

        //Bomb
        bombs = this.physics.add.group({
            key: 'bomb',
            repeat: 4,
            setXY: { x: 50, y: 50, stepX: 140 }
        });

        bombs.children.iterate(function (child) {
            child.setBounceY(0);
            child.body.setGravityY(Math.floor((Math.random() * 10) + 1));
            child.body.setVelocityY(100);
        });

        //Score-Board
        scoreText = this.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: 'white' });

        //Animate character movement
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

        //Collision Detection
        this.physics.add.collider(player, platforms);
        this.physics.add.collider(stars, platforms);
        this.physics.add.collider(bombs, platforms);

        this.physics.add.overlap(player, stars, collectStars, null, this);
        this.physics.add.collider(player, bombs, hitBomb, null, this);

        //keyboard events
        keyClicked = this.input.keyboard.createCursorKeys();

        //Playback Music and looping it
        playbackMusic = this.sound.add('despacito');
        playbackMusic.volume = 0.5;
        playbackMusic.loop = true;
        playbackMusic.play();

        // jump sound
        jumpSound = this.sound.add('jump');
        jumpSound.volume = 0.8;

        //Explode sound
        explodeSound = this.sound.add('explode');
        explodeSound.volume = 0.8;

        starCollectSound = this.sound.add('collectStar');
        starCollectSound.volume = 1;
    }

    function update() {

        if (!gameOver) {
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
                // console.log('jump', jumpHeight);
                if (jumpHeight <= 20) {
                    player.setVelocityY(-200);
                }
                if (player.body.touching.down) {
                    jumpHeight = 0;
                    jumpSound.play(); //jump sound
                    /**
                     * use jumpHeight to create jet pack value
                     */
                }
            }
        }
    }

    function hitBomb(player, bomb) {

        player.setTint(0xff0000);
        player.anims.play('turn');
        this.physics.pause();
        // player.physics.pause();
        gameOver = true;
        playbackMusic.pause();
        explodeSound.play();

        gameOverText = this.add.text(300, 230, 'GAME OVER', { fontSize: '40px', fill: 'red' });
    }

    function collectStars(player, star) {
        // console.log("yuhuuu collected");
        star.disableBody(true, true);
        starCollectSound.play();
        score += 10;
        scoreText.setText('Score: ' + score);

        if (stars.countActive(true) === 0) {

            stars.children.iterate(function (child) {

                child.enableBody(true, child.x, 0, true, true);

            });

            var x = (player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);

            var bomb = bombs.create(x, 16, 'bomb');
            bomb.setBounce(1);
            bomb.setCollideWorldBounds(true);
            bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
        }
    }

    var game = new Phaser.Game(config);
}

$(document).ready(function () {
    // $div = $('<div></div>').addClass('asdasd').appendTo('body');
    // alert("window is loaded");
    init();
    // console.clear();
});