function dist(x, y, x0, y0) {
    return Math.sqrt((x -= x0) * x + (y -= y0) * y);
}

function throwGrenade(guy, otherGuy, xVelocity, yVelocity) {
    this.x = guy.body.x;
    this.y = guy.body.y;
    this.xVelocity = xVelocity;
    this.yVelocity = yVelocity;
    grenades[currentGrenade].otherGuy = otherGuy;
    grenades[currentGrenade].body.x = this.x;
    grenades[currentGrenade].body.y = this.y;
    // game.time.events.add(Phaser.Timer.SECOND * 2, explode(this.otherGuy, grenade, 300), this);
    grenades[currentGrenade].timer = game.time.now + 4000;
    console.log("grenade timer " + grenades[currentGrenade].timer);
    console.log("game time " + game.time.now);
        grenades[currentGrenade].body.velocity.x = this.xVelocity;
        grenades[currentGrenade].body.velocity.y = this.yVelocity;
    currentGrenade++;
}
//meant to draw a red arc that slowly circles around the character to represent the angle the grenade is to be thrown at.
function computeAngle(center, target, otherGuy) { //move this to main later b/c this doesn't need to be self sufficient. Or don't. If you can make it work this way.
    this.target = target;
    this.center = center;
    //this.strength = this.strength/2 + this.strength/dist(this.victim.body.x, this.victim.body.y, this.nade.body.x, this.nade.body.y);
    //console.log("strength " + this.strength);
    this.xDif = this.target.x - this.center.body.x;
    this.yDif = this.target.y - this.center.body.y;
    this.totalDif = Math.abs(this.xDif) + Math.abs(this.yDif);
    if (this.totalDif == 0) this.totalDif = 100; //correcting for division by zero error
    this.xDif = (this.xDif / this.totalDif) * 700;
    this.yDif = (this.yDif / this.totalDif) * 700;
    //console.log("xDif " + this.xDif);
    //console.log("yDif " + this.yDif);
    center.coolDown = game.time.now + 700;
    throwGrenade(this.center, otherGuy, this.xDif, this.yDif);
}

function explode(victim, nade, strength) {
    console.log("boom");
    this.victim = victim;
    this.nade = nade;
    this.strength = strength;
    if (dist(this.victim.body.x, this.victim.body.y, this.nade.body.x, this.nade.body.y) <= 150) {
        //this.strength = this.strength/2 + this.strength/dist(this.victim.body.x, this.victim.body.y, this.nade.body.x, this.nade.body.y);
        this.xDif = this.victim.body.x - this.nade.body.x;
        this.yDif = this.victim.body.y - this.nade.body.y;
        this.totalDif = Math.abs(this.xDif) + Math.abs(this.yDif);
        if (this.totalDif == 0) this.totalDif = 100; //correcting for division by zero error
        this.xDif = (this.xDif / this.totalDif) * this.strength;
        this.yDif = (this.yDif / this.totalDif) * this.strength;
        this.victim.body.velocity.x = this.xDif;
        this.victim.body.velocity.y = (this.yDif + 250);
        victim.stunned = game.time.now + 1000;
    }
    this.nade.body.x = 1500;
    this.nade.body.y = 700;
    this.nade.body.velocity.x = 0;
    this.nade.body.velocity.y = 0;
}

function respawn() {
    health = 100;
    player.body.x = 32;
}

function erespawn() {
    ehealth = 100;
    enemy.body.x = 780;
}

function collisionHandler(grenade, enemy) {
    grenade.kill;
    ehealth -= 10;
    enemy.body.velocity.x += 30;
    enemy.body.velocity.y -= 20;
}