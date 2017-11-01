var score = $('#score');

// Main Constructor/ Class for OOP
var Unit = function(x, y, sprite) {
    // the x and y dimentions variables
    this.x = x;
    this.y = y;
    // The image/sprite for our enemies or the player
    this.sprite = sprite;
}

// To render the Image to the canvas
Unit.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

// Enemies our player must avoid
var Enemy = function(y, speed) {
    Unit.call(this, randomInRange(-1100, -50), y, 'images/enemy-bug.png');
    this.speed = speed;
};

// Inherit form Unit Constructor
Enemy.prototype = Object.create(Unit.prototype);
Enemy.prototype.constructor = Enemy;

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for all computers.
    this.x = this.x + (this.speed * dt);
};


// The player Constructor 
var Player = function() {
    Unit.call(this, 200, 400, 'images/char-boy.png');
}

// Inherit form Unit Constructor
Player.prototype = Object.create(Unit.prototype);
Player.prototype.constructor = Player;

// Update the player position
Player.prototype.update = function(x, y) {
    if(x != undefined && y != undefined) {
        this.x += x;
        this.y += y;
    }
};

// handle the player position
Player.prototype.handleInput = function(key) {
    if (key === 'left' && this.x != 0) {
        this.update(-100, 0);
    }
    if (key === 'right' && this.x != 400) {
        this.update(100, 0);
    }
    if (key === 'up' && this.y != 0) {
        this.update(0, -80);
    }
    if (key === 'down' && this.y != 400) {
        this.update(0, 80);
    }
    if(this.y === 0) {
        var scoreTotal = Number(score.text());
        score.text(scoreTotal + 1);
        var self = this;
        setTimeout(function() {
            self.moveToStart();
        }, 100);
    }
    
};

// check collision and call it inside engine update canvas
Player.prototype.checkCollision = function(enemies) {
    enemies.forEach(function(enemy) {
        var betweenx = player.x - enemy.x,
        betweeny = player.y - enemy.y;
        if ( betweeny == 0 && betweenx >= 0 && betweenx < 90) { 
            reset();
        }
    });
}

// Move to start
Player.prototype.moveToStart = function() {
    this.x = 200;
    this.y = 400;
}

// Place all enemy objects in an array called allEnemies
var allEnemies = [new Enemy(80, 50), new Enemy(240, 100)];

// Place the player object in a variable called player
var player = new Player();

// setInterval to push enemies every second or less
var interval = setInterval(function() {
    var positions = [80, 160, 240];
    var randomSpeed = randomInRange(50, 350);
    var randomPosition = positions[Math.floor(Math.random() * positions.length)];
    allEnemies.push(new Enemy(randomPosition, randomSpeed));
}, 900)

// This listens for key presses and sends the keys to your
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };
    player.handleInput(allowedKeys[e.keyCode]);
});


// get a random value between a given range
function randomInRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

// rest scores and move to start
function reset() {
    player.moveToStart();
    score.text('0');
}