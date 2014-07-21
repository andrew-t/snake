var length = 100;
var step = 3;
var colrad = step * 2;
var fieldrad = 100;
var iturnangle = 0.2; // radians
var turnanglemultiplier = 0.85;
var minturnangle = 0.05;
var framerate = 100; // ms per frame
var pipbuffer = 20;

function init() {
	$('body').keydown(function(e) {
		switch (e.which) {
			case 37:
				ldown = true;
				break;
			case 39:
				rdown = true;
				break;
		}
	});
	$('body').keyup(function(e) {
		switch (e.which) {
			case 37:
				ldown = false;
				break;
			case 39:
				rdown = false;
				break;
		}
	});
	setInterval(frame, framerate);
}

var gameon = false;
var ldown = false;
var rdown = false;
var x;
var y;
var angle;
var turnangle;
var head = 0;
var pipx;
var pipy;

function newgame() {
	angle = 0;
	x=[]; y=[];
	$('#snake').html("");
	for (var i=0; i<length; ++i) {
		x[i] = -fieldrad * 10; y[i] = -fieldrad * 10;
		$('#snake').append('<div id="s'+i+'"></div>');
		placebit(i);
	}
	x[head] = 0; y[head] = 0;
	placebit(head);
	turnangle = iturnangle;
	droppip();
	gameon = true;
}

var colrad2 = colrad*colrad;
var fieldrad2 = fieldrad*fieldrad;

function frame() {
	if (!gameon) return;
	if (ldown) angle -= turnangle;
	if (rdown) angle += turnangle;
	var lasthead = head;
	head = (head + 1) % length;
	$('#s'+lasthead).removeClass('head');
	$('#s'+head).addClass('head');
	x[head] = x[lasthead] + step * Math.cos(angle);
	y[head] = y[lasthead] + step * Math.sin(angle);
	placebit(head);
	// out of range
	if (x[head] * x[head] + y[head] * y[head] > fieldrad2)
		gameover();
	// autocollision
	for (var i = (head + length - 3) % length;
			i != head; 
			i = (i + length - 1) % length) {
		var dx = x[head] - x[i];
		var dy = y[head] - y[i];
		if (dx*dx + dy*dy < colrad2)
			gameover();
	}
	// pip
	var dx = x[head] - pipx;
	var dy = y[head] - pipy;
	if (dx*dx + dy*dy < colrad2) {
		turnangle *= turnanglemultiplier;
		if (turnangle < minturnangle)
			turnangle < minturnangle;
		droppip();
	}
}

function placebit(i) {
	$('#s'+i).css({
		'left': x[i]+'px',
		'top': y[i]+'px'
	});
}

function gameover() {
	gameon = false;
}

var pipbuffer2 = pipbuffer*pipbuffer;

function droppip() {
	var okay = false;
	while (!okay) {
		okay = true;
		pipx = (Math.random()-0.5) * fieldrad * 2;
		pipy = (Math.random()-0.5) * fieldrad * 2;
		if (pipx*pipx + pipy*pipy > fieldrad2) {
			okay = false;
			continue;
		}
		for (var i = 0; i < length; ++i) {
			var dx = pipx - x[i];
			var dy = pipy - y[i];
			if (dx*dx + dy*dy < pipbuffer2) {
				okay = false;
				break;
			}
		}
	}
	$('#pip').css({
		'left': (pipx+fieldrad)+'px',
		'top': (pipy+fieldrad)+'px'
	});
}