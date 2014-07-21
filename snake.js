var ilength = 100, dlength = 10, maxlength = 300;
var step = 5, colrad = 22.5, headrad = 15, fieldrad = 300, pipbuffer = 50;
var iturnangle = 0.2, turnanglemultiplier = 0.85, minturnangle = 1.1 * step / fieldrad; // radians
var framerate = 50; // ms per frame

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
			case 32: //spacebar
				if (!gameon) newgame();
				break;
		}
	});
	$('#game').css({
		'width': (fieldrad*2) + 'px',
		'height': (fieldrad*2) + 'px'
	});
	gameover();
	$('#game').hide();
	setInterval(frame, framerate);
}

var gameon;
var ldown = false, rdown = false;
var x, y, angle;
var turnangle, length, score;
var head = 0;
var pipx, pipy;

function newgame() {
	angle = 0;
	length = ilength;
	x=[]; y=[];
	$('#snake').html("");
	for (var i=0; i<maxlength; ++i) {
		$('#snake').append('<div id="s'+i+'"></div>');
		hidebit(i);
	}
	head = 0;
	x[head] = 0; y[head] = 0;
	placebit(head);
	turnangle = iturnangle;
	droppip();
	$('#start').hide();
	$('#game').show();
	$('#score').html('0');
	score = 0;
	gameon = true;
}

function hidebit(i) {
	x[i] = -fieldrad * 10;
	y[i] = -fieldrad * 10;
	placebit(i);
}

var colrad2 = colrad*colrad;
var fieldrad2 = (fieldrad-headrad)*(fieldrad-headrad);
var safecols = Math.floor(colrad / step) + 1;

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
	for (var i = (head + length - safecols) % length;
			i != head; 
			i = (i + length - 1) % length) {
		var dx = x[head] - x[i],
			dy = y[head] - y[i];
		if (dx*dx + dy*dy < colrad2)
			gameover();
	}
	// pip
	var dx = x[head] - pipx,
		dy = y[head] - pipy;
	if (dx*dx + dy*dy < colrad2) {
		// increase turning circle
		turnangle *= turnanglemultiplier;
		if (turnangle < minturnangle)
			turnangle = minturnangle;
		// increase snake length
		if (length < maxlength) {
			for (var i = length - 1; i > head; --i) {
				x[i + dlength] = x[i];
				y[i + dlength] = y[i];
				placebit(i + dlength);
			}
			for (var i = 1; i <= dlength; ++i)
				hidebit(head + i);
			length += dlength;
		}
		// gubbins
		$('#score').html(++score);
		droppip();
	}
}

function placebit(i) {
	$('#s'+i).css({
		'left': (x[i]+fieldrad) + 'px',
		'top': (y[i]+fieldrad) + 'px'
	});
}

function gameover() {
	gameon = false;
	$('#start').show();
}

var pipbuffer2 = pipbuffer*pipbuffer;
var pipr = fieldrad-pipbuffer;
var pipr2 = pipr*pipr;

function droppip() {
	var okay = false;
	while (!okay) {
		okay = true;
		pipx = (Math.random()-0.5) * fieldrad * 2;
		pipy = (Math.random()-0.5) * fieldrad * 2;
		if (pipx*pipx + pipy*pipy > pipr2) {
			okay = false;
			continue;
		}
		for (var i = 0; i < length; ++i) {
			var dx = pipx - x[i],
				dy = pipy - y[i];
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