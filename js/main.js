// RequestAnimFrame: a browser API for getting smooth animations
window.requestAnimFrame = (function(){
	return  window.requestAnimationFrame       ||
		window.webkitRequestAnimationFrame ||
		window.mozRequestAnimationFrame    ||
		window.oRequestAnimationFrame      ||
		window.msRequestAnimationFrame     ||
		function( callback ){
			return window.setTimeout(callback, 1000 / 60);
		};
})();

window.cancelRequestAnimFrame = ( function() {
	return window.cancelAnimationFrame          ||
		window.webkitCancelRequestAnimationFrame    ||
		window.mozCancelRequestAnimationFrame       ||
		window.oCancelRequestAnimationFrame     ||
		window.msCancelRequestAnimationFrame        ||
		clearTimeout
} )();


// Initialize canvas and required variables
var canvas = document.getElementById("canvas"),
	ctx = canvas.getContext("2d"), // Create canvas context
	W = 1000, // Window's width
	H = window.innerHeight / 1.25, // Window's height
	ball, // Ball object
	paddle, // Paddle object
	boxes = [], // Array for boxes
	mouse = {}, // Mouse object to store it's current position
	points = 199, // Variable to store points
	fps = 60; // Max FPS (frames per second)

// Add mousemove and mousedown events to the canvas
document.addEventListener("mousemove", trackMouse, true);
document.addEventListener("mousedown", mouseClick, true);

// Track the position of mouse cursor
function trackMouse(e) {
	mouse.x = e.pageX;
	mouse.y = e.pageY;
}

// On button click (Restart and start)
function mouseClick(e) {
	// Variables for storing mouse position on click
	var mx = e.pageX,
		my = e.pageY;
}

// Set the canvas's height and width to full screen
canvas.width = W;
canvas.height = H;

// Function to paint canvas
function clearCanvas() {
	ctx.fillStyle = "black";
	ctx.fillRect(0, 0, W, H);
}

function Paddle() {
	this.width = 150;
	this.height = 15;

	this.x = W / 2;
	this.y = H - 15;

	this.update = function() {
		if (mouse.x) {
			this.x = mouse.x;
		}
	},

	this.draw = function() {
		ctx.fillStyle = "white";
		ctx.fillRect(this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);
	}
}

// Make a collidable box
function Box(x, y) {

	//isColliding = false;
	this.width = 30;
	this.height = 15;

	this.x = x;
	this.y = y,

	this.draw = function() {
		ctx.fillStyle = "red";
		ctx.fillRect(this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);
	}

}

// Ball object
function Ball() {
	this.x = 50;
	this.y = 50;
	this.r = 5;
	this.c = "white";
	this.vx = 4;
	this.vy = 8;

	// Function for updating the position of the ball
	this.update = function() {
		this.x+= this.vx;
		this.y+= this.vy;
	}

	// Function for drawing ball on canvas
	this.draw = function() {
		ctx.beginPath();
		ctx.fillStyle = this.c;
		ctx.arc(this.x, this.y, this.r, 0, Math.PI*2, false);
		ctx.fill();
	}

	// Function for drawing ball on canvas
	this.testCollisions = function() {
		if (this.x > W || this.x < 0) {
			this.vx = -this.vx;
		}

		if (this.y < 0) {
			this.vy = -this.vy;
		}

		if (this.y > H) {

		}

		if (this.y >= paddle.y - paddle.height / 2 && this.y <= paddle.y + paddle.height / 2) {
			if (this.x >= paddle.x - paddle.width / 2 && this.x <= paddle.x + paddle.width / 2) {
				this.vy = -this.vy;
			}
		}

		for (var i = 0; i < boxes.length; i++) {
			box = boxes[i];

			if (this.y >= box.y - box.height / 2 && this.y <= box.y + box.height / 2) {
				if (this.x >= box.x - box.width / 2 && this.x <= box.x + box.width / 2) {
					this.vy = -this.vy;
					points = points-1;
                    boxes.splice(i, 1);
				}

			}
		}
	}
}

// Function to update positions, score and everything.
// Basically, the main game logic is defined here
function loop() {

	clearCanvas();

	// Update scores
	updateScore();

	// Update positions
	paddle.update();
	ball.update();
	ball.testCollisions();

	// Draw stuff on canvas
	paddle.draw();
	ball.draw();

	for (var i = 0; i < boxes.length; i++) {
		boxes[i].draw();
	};

	requestAnimFrame(loop);

}

// Function for updating score
function updateScore() {
	ctx.fillStyle = "white";
	ctx.font = "16px Arial, sans-serif";
	ctx.textAlign = "left";
	ctx.textBaseline = "top";
	ctx.fillText("Kansanedustajia: " + points, 20, 20 );
}

function initGame() {

	paddle = new Paddle();
	ball = new Ball();

	for (var i = 0; i < 21; i++) {
		boxes.push(new Box(100+(i * 40), 60));
	};
	for (var i = 0; i < 21; i++) {
		boxes.push(new Box(100+(i * 40), 85));
	};

	requestAnimFrame(loop);

}

initGame();
