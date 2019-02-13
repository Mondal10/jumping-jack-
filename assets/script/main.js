function init(){
    var platforms;
    // configuration to create scene
    var config = {
        type: Phaser.AUTO, 
        width: 800,
        height: 600,
        physics: {
            default: 'arcade',
            gravity: {y: 300},
            debug: false
        },
        scene: {
            preload: preload,
            create: create,
            update: update
        }
    };

    function preload ()
    {
        this.load.image('sky','../../assets/images/sky.png');
        this.load.image('platform','../../assets/images/platform.png');
        this.load.image('star','../../assets/images/star.png');
        this.load.image('bomb','../../assets/images/bomb.png');
        this.load.spritesheet('jack','../../assets/images/jack.png',{ frameWidth: 32, frameHeight: 48 });
    }
    
    function create ()
    {
        this.add.image(0, 0, 'sky').setOrigin(0, 0); //or use image(400, 300, 'sky') without setorigin
       
        platforms = this.physics.add.staticGroup();
        platforms.create(400, 568, 'platform').setScale(2).refreshBody(); // The call to refreshBody() is required because we have scaled a static physics body, so we have to tell the physics world about the changes we made.
        platforms.create(600, 400, 'platform');
        platforms.create(50, 250, 'platform');
        platforms.create(750, 220, 'platform');
    }
    
    function update ()
    {
    }

    var game = new Phaser.Game(config);
}

$(document).ready(function() {
    // $div = $('<div></div>').addClass('asdasd').appendTo('body');
    // alert("window is loaded");
    init();
});