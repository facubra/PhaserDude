import Phaser from "phaser";

class Escena extends Phaser.Scene {

    platform = null;
    play = null;
    cursors = null;
    stars = null;
    score = null;
    bomb = null;
    scoreText;

    preload() {
        this.load.image('sky', 'img/sky.png');
        this.load.image('ground', 'img/platform.png');
        this.load.image('star', 'img/star.png');
        this.load.image('bomb', 'img/bomb.png');
        this.load.spritesheet('dude',
            'img/dude.png',
            { frameWidth: 32, frameHeight: 48 }
        );
    }
    create() {
        //background
        this.add.image(400, 300, 'sky');

        //plataformas
        this.platform = this.physics.add.staticGroup();

        this.platform.create(400, 568, 'ground').setScale(2).refreshBody();

        this.platform.create(600, 400, 'ground');
        this.platform.create(50, 250, 'ground');
        this.platform.create(750, 220, 'ground');
    
        //personaje
        this.player = this.physics.add.sprite(100, 450, 'dude');

        //fisica del pj - colision
        this.player.setBounce(0.2);
        this.player.setCollideWorldBounds(true);
        

        //colision del pj con las plataformas
        this.physics.add.collider(this.player, this.platform);

        //sprites de movimiento del pj - asignacion de teclas para el movimiento
        this.cursors = this.input.keyboard.createCursorKeys();

        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'turn',
            frames: [{ key: 'dude', frame: 4 }],
            frameRate: 20
        });

        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
            frameRate: 10,
            repeat: -1
        });

        //se agrega conjunto de estrellas
        this.stars = this.physics.add.group({
            key: 'star',
            repeat: 11,
            setXY: { x: 12, y: 0, stepX: 70 }
        });

        this.stars.children.iterate(function (child) {
            child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));

        });

        //colision de las estrellas con las plataformas
        this.physics.add.collider(this.stars, this.platform);

        //colision del pj con estrellas
        this.physics.add.overlap(this.player, this.stars, this.collectStar, null, this);

        //puntuacion
        this.scoreText = this.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });

        //se agrega las bombas
        this.bombs = this.physics.add.group();

        //colision de las bombas con las plataformas   
        this.physics.add.collider(this.bombs, this.platforms);

        //colision del pj con las bombas
        this.physics.add.collider(this.player, this.bombs, this.hitBomb, null, this);

    }

    update() {
        //Movimiento del pj mediante teclas de direccion
        if (this.cursors.left.isDown) {
            this.player.setVelocityX(-160);

            this.player.anims.play('left', true);
        }
        else if (this.cursors.right.isDown) {
            this.player.setVelocityX(160);

            this.player.anims.play('right', true);
        }
        else {
            this.player.setVelocityX(0);

            this.player.anims.play('turn');
        }
        if (this.cursors.up.isDown && this.player.body.touching.down) {
            this.player.setVelocityY(-330);
        }
    }


    //funcion recolectar, desaparecer estrellas - puntaje aumente
    collectStar(player, star) {
        star.disableBody(true, true);
        this.score += 10;
        this.scoreText.setText('Score: ' + this.score);
        
        if (this.stars.countActive(true) === 0) {
            this.stars.children.iterate(function (child) {

                child.enableBody(true, child.x, 0, true, true);

            });

            var x = (this.player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);

            var bomb = this.bombs.create(x, 16, 'bomb');
            bomb.setBounce(1);
            bomb.setCollideWorldBounds(true);
            bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
        }
    }
    
    //funcion cuando el pj choque con una bomba se termine el juego
    hitBomb(player, bomb) {
        this.physics.pause();
        player.setTint(0xff0000);
        player.anims.play('turn');
        this.add.text(325, 300, 'Game Over', { fontSize: '32px', fill: '#000' });
        this.gameOver = true;
    }

    

}

export default Escena;