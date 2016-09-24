var game = new Phaser.Game(1656, 768, Phaser.CANVAS, 'phaser-example', {
    preload: preload,
    create: create,
    update: update,
});



//TODO: FIX GROUNDED



//TODO: Implement good explosion detection by adding for loops to constantly check for explosions

function preload() {
    //game.load.image('player', 'Assets/default.gif', 32, 430);
    game.load.spritesheet('player', 'Assets/player.png', 100, 100, 100);
    game.load.spritesheet('grenade', 'Assets/grenade.png', 100, 100, 100);
    game.load.image('background', 'Assets/background_wide.jpg');
    game.load.image('crosshair', 'Assets/crosshair.png');
    game.load.audio('boom', 'Assets/boom.mp3');
}

function create() {
    game.physics.startSystem(Phaser.Physics.ARCADE);
    game.stage.backgroundColor = '#000000';

    bg = game.add.tileSprite(0, 0, 1656, 768, 'background');
    bg.fixedToCamera = true;
    grenades = [];
    player = game.add.sprite(32, 650, 'player');
    enemy = game.add.sprite(780, 650, 'player');

    crosshair = game.add.sprite(1, 1, 'crosshair');
    crosshair.scale.setTo(0.07, 0.07);
    ecrosshair = game.add.sprite(1, 1, 'crosshair');
    ecrosshair.scale.setTo(0.07, 0.07);

    player.animations.add('stand', [0]);
    player.animations.add('walk', [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]);
    player.animations.add('jump', [18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38]);
    player.animations.add('fall', [39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55]);
    player.animations.add('throwRight', [56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75]);
    player.animations.add('throwLeft', [77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95]);

    enemy.animations.add('stand', [0]);
    enemy.animations.add('walk', [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]);
    enemy.animations.add('jump', [18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38]);
    enemy.animations.add('fall', [39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55]);
    enemy.animations.add('throwRight', [56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75]);
    enemy.animations.add('throwLeft', [77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95]);

    boom = game.add.audio('boom');
    maxGrenades = 100;
    for (var i = 0; i < maxGrenades; i++) {
        grenades.push(game.add.sprite(3000, 3000, 'grenade'));
    }
    
    currentGrenade = 0;
    // grenades = game.add.group();
    // grenades.enableBody = true;
    // grenades.physicsBodyType = Phaser.Physics.ARCADE;
    // grenades.createMultiple(2, 'grenade');
    // grenades.setAll('anchor.x', 0.5);
    // grenades.setAll('anchor.y', 1);
    // grenades.setAll('outOfBoundsKill', true);
    // grenades.setAll('checkWorldBounds', true);

    game.physics.enable(enemy, Phaser.Physics.ARCADE);
    game.physics.enable(player, Phaser.Physics.ARCADE);

    for (var o = 0; o < maxGrenades; o++) {
        game.physics.enable(grenades[o], Phaser.Physics.ARCADE);
        grenades[o].body.gravity.y = 250;
        grenades[o].body.collideWorldBounds = true;
        grenades[o].body.bounce.set(0.5);
        grenades[o].body.setSize(50, 30, 10, 10);
        grenades[o].timer = -1;
        grenades[o].otherGuy;
    }

    grenades[currentGrenade].animations.add('dormant', [0]);
    grenades[currentGrenade].animations.add('erupt', [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 15]);
    player.gAngle = 0;
    enemy.gAngle = 180;
    game.world.setBounds(0, 0, 1600, 750);

    player.body.gravity.y = 400;
    enemy.body.gravity.y = 400;

    player.body.collideWorldBounds = true;

    player.body.setSize(30, 100, 35);
    enemy.body.collideWorldBounds = true;
    enemy.body.setSize(30, 100, 35);


    player.stunned = -1;
    enemy.stunned = -1;
    player.coolDown = 0;
    enemy.coolDown = 0;

    aKey = game.input.keyboard.addKey(Phaser.Keyboard.A);
    wKey = game.input.keyboard.addKey(Phaser.Keyboard.W);
    dKey = game.input.keyboard.addKey(Phaser.Keyboard.D);
    fKey = game.input.keyboard.addKey(Phaser.Keyboard.F);
    cursors = game.input.keyboard.createCursorKeys();
    lKey = game.input.keyboard.addKey(Phaser.Keyboard.L);
    JKey = game.input.keyboard.addKey(Phaser.Keyboard.J);
    KKey = game.input.keyboard.addKey(Phaser.Keyboard.K);
    RKey = game.input.keyboard.addKey(Phaser.Keyboard.R);
    TKey = game.input.keyboard.addKey(Phaser.Keyboard.T);


    graphics = game.add.graphics(game.world.centerX, game.world.centerY);
    //window.graphics = graphics;
}

//player.direction = "left";


function update() {

    if (!grounded && player.body.velocity.y >= 0) {
        player.animations.play('fall');
    }

    if (!egrounded && enemy.body.velocity.y >= 0) {
        //enemy.animations.play('fall');
    }

    ecrosshair.x = (enemy.body.x + 100 * Math.cos(game.math.degToRad(enemy.gAngle)) - 10);
    ecrosshair.y = (enemy.body.y + 100 * Math.sin(game.math.degToRad(enemy.gAngle)) + 20);
    crosshair.x = (player.body.x + 100 * Math.cos(game.math.degToRad(player.gAngle)) - 10);
    crosshair.y = (player.body.y + 100 * Math.sin(game.math.degToRad(player.gAngle)) + 20);

    if (currentGrenade == maxGrenades) currentGrenade = 0;
    if (Math.ceil(player.stunned / 1000) > Math.ceil(game.time.now / 1000)) {
        if (player.body.velocity.x > 0) {
            player.body.velocity.x = player.body.velocity.x - 2;
        }
        if (player.body.velocity.x < 0) {
            player.body.velocity.x = player.body.velocity.x + 2;
        }
    }
    else {
        player.body.velocity.x *= 0.9;
    }
    if (Math.ceil(enemy.stunned / 1000) > Math.ceil(game.time.now / 1000)) {
        if (enemy.body.velocity.x > 0) {
            enemy.body.velocity.x = enemy.body.velocity.x - 2;
        }
        if (enemy.body.velocity.x < 0) {
            enemy.body.velocity.x = enemy.body.velocity.x + 2;
        }
        console.log(enemy.body.velocity.x);
    }
    else {
        enemy.body.velocity.x *= 0.9;
    }
    for (var i = 0; i < maxGrenades; i++) {
        grenades[i].body.velocity.x *= 0.99;
    }


    for (var i = 0; i < maxGrenades; i++) {
        if (Math.ceil(grenades[i].timer / 1000) == Math.ceil(game.time.now / 1000)) {
            grenades[i].animations.play('erupt');
            explode(grenades[i].otherGuy, grenades[i], 1000);
            grenades[i].timer = -1;
            // grenade.body.x = 1500;
            // grenade.body.y = 700;
        }
    }

    if (player.body.y > 430) {
        grounded = true;
    }
    else {
        grounded = false;
    }
    if (grounded == true && player.body.velocity.y > 0) {
        // player.body.y = 430;
        // player.body.velocity.y = 0;
    }
    if (enemy.body.y > 430) {
        egrounded = true;
    }
    else {
        egrounded = false;
    }
    if (Math.ceil(player.stunned / 1000) < Math.ceil(game.time.now / 1000)) {
        if (aKey.isDown) {
            player.body.velocity.x = -200;
            player.direction = "left";
            player.animations.play('walk');
        }
        if (dKey.isDown) {
            player.body.velocity.x = 200;
            player.direction = "right";
            player.animations.play('walk');
        }
    }

    if (Math.ceil(enemy.stunned / 1000) < Math.ceil(game.time.now / 1000)) {
        if (cursors.left.isDown) {
            enemy.body.velocity.x = -200;
            enemy.animations.play('walk');
        }
        if (cursors.right.isDown) {
            enemy.body.velocity.x = 150;
            enemy.animations.play('walk');
        }
    }
    //KKey.onDown(angle++);
    if (KKey.isDown) {
        enemy.gAngle++;
    }

    if (JKey.isDown) {
        enemy.gAngle--;
    }

    if (TKey.isDown) {
        player.gAngle++;
    }

    if (RKey.isDown) {
        player.gAngle--;
    }

    //fkey.onkeydown();
    //if (Math.ceil(player.coolDown / 1000) < (Math.ceil(game.time.now / 1000))) {
    if (player.coolDown < game.time.now) {
        if (fKey.isDown && (Math.ceil(player.stunned / 1000)) < Math.ceil(game.time.now / 1000)) {
            computeAngle(player, crosshair, enemy);
            player.animations.play('throwRight');
            // player.animations.play('throwLeft');
        }
    }

    if (enemy.coolDown < game.time.now) {
        if (lKey.isDown && (Math.ceil(enemy.stunned / 1000) < Math.ceil(game.time.now / 1000))) {
            computeAngle(enemy, ecrosshair, player);
            // enemy.animations.play('throwRight');
            enemy.animations.play("throwLeft");

        }
    }

    if ((wKey.isDown && grounded) && (Math.ceil(enemy.stunned / 1000) < Math.ceil(game.time.now / 1000))) {
        grounded = false;
        player.body.velocity.y = -250;
        player.animations.play('jump');

    }
    else {
        grounded = true;
    }
    if ((cursors.up.isDown && egrounded) && (Math.ceil(enemy.stunned / 1000) < Math.ceil(game.time.now / 1000))) {
        egrounded = false;
        enemy.body.velocity.y = -250;
        enemy.animations.play('jump');
    }
    if (egrounded == true && enemy.body.velocity.y > 0) {
        // enemy.body.y = 430;
        // enemy.body.velocity.y = 0;
    }
    else {
        egrounded = false;
    }

    if (health == 0) {
        dead = true;
    }
    if (ehealth == 0) {
        edead = true;
    }

    if (dead) {
        player.body.x = 2900;
        setTimeout(respawn, 4000);
        dead = false;
    }
    if (edead) {
        enemy.body.x = 2900;
        setTimeout(erespawn, 4000);
        edead = false;
    }
    //game.physics.arcade.overlap(grenades, enemy, collisionHandler, null, this);
}
