function init(){
    // configuration to create scene
    var config = {
        type: Phaser.AUTO, 
        width: 800,
        height: 600,
        scene: {
            preload: preload,
            create: create,
            update: update
        }
    };

    var game = new Phaser.Game(config);

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
        this.add.image(400, 300, 'star');
    }
    
    function update ()
    {
    }

}

$(document).ready(function() {
    // $div = $('<div></div>').addClass('asdasd').appendTo('body');
    // alert("window is loaded");
    init();
});