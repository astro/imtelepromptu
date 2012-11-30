var contexts; /* input, play, log jQuery */

var scrollInterval = 25;
var currentLine = 0, ty = 0, y = 0;
var lines = [];
var playing = false;

function setCurrentLine(line) {
    $('#lines').find('.line').eq(currentLine).removeClass('current');
    currentLine = line;
    $('#lines').find('.line').eq(currentLine).addClass('current');

    var wh = $(window).innerHeight();
    ty = -wh + 64;
    for(var i = 0; i <= currentLine; i++) {
	var h = $('#lines').find('.line').eq(i).outerHeight();
	if (i < currentLine)
	    ty += h;
	else if (h >= wh)
	    ty += h;
	else
	    ty += wh - 68;
    }
    updateScrolling();
}

var scrollTimeout;

function updateScrolling() {
    function setScrollTimeout() {
	if (!scrollTimeout)
	    scrollTimeout = setTimeout(function() {
					   scrollTimeout = null;
					   updateScrolling();
				       }, scrollInterval);
    }

    var scrollSpeed = (playing ? 4 : 40) * (0.5 + Math.abs(y - ty) / $(window).innerHeight());

    if (y < ty) {
	y += scrollSpeed;
	if (y > ty)
	    y = ty;
	setScrollTimeout();
    } else if (y > ty) {
	y -= scrollSpeed;
	if (y < ty)
	    y = ty;
	setScrollTimeout();
    } else {
	y = ty;
    }
    // console.log("scrollSpeed", scrollSpeed, "y", y);
    $('#lines').css('top', -y + "px");
}

var timeOffset, playTime;
var currentLog;

function pad(s, padding, length) {
    if (typeof s != 'string')
	s = s.toString();
    while(s.length < length)
	s = padding + s;
    return s;
}

function log(t, s) {
    if (!currentLog)
	return;

    var hour = Math.floor(t / 3600000);
    var min = Math.floor(t / 60000) % 60;
    var sec = Math.floor(t / 1000) % 60;
    var msec = t % 1000;
    var ts = hour + ":" + pad(min, '0', 2) + ":" + pad(sec, '0', 2) + "." + pad(msec, '0', 3);
    var span = $('<span></span>');
    span.text(ts + " " + s + "\n");
    currentLog.append(span);
}

var contextInit = {
    input: function() {
    },

    play: function() {
	timeOffset = 0;
	function canLog() {
	    if (playing) {
		var t = timeOffset + new Date().getTime() - playTime;
		log(t, lines[currentLine]);
	    }
	}
	$('#play_prev').click(function() {
	    setCurrentLine(Math.max(0, currentLine - 1));
	    canLog();
	});
	$('#play_play').click(function() {
	    playing = !playing;
	    if (playing) {
		timeOffset += 0;
		playTime = new Date().getTime();
		canLog();
	    } else
		timeOffset += new Date().getTime() - playTime;
	    $('#play_play').text(playing ? "■" : "▶");
	    updateScrolling();
	});
	$('#play_next').click(function() {
	    setCurrentLine(Math.min(lines.length - 1, currentLine + 1));
	    canLog();
	});
    },

    log: function() {
    }
};

var contextActivate = {
    input: function() {
    },

    play: function() {
	var textarea = contexts.input.find('textarea');
	lines = textarea.val().split(/\s*\n\s*/);
	var el = contexts.play.find('#lines');
	el.empty();
	lines.forEach(function(line) {
	    var p = $('<p class="line"></p>');
	    p.text(line);
	    el.append(p);
	});

	currentLog = $('<pre></pre>');
	var article = $('<article><h2>Log run</h2></article>');
	article.append(currentLog);
	$('#log').prepend(article);
	y = - $(window).innerHeight() / 2;
	setCurrentLine(0);
    },

    log: function() {
    }
};

function switchNavigation(target) {
    for(var context in contexts) {
	if (context === target)
	    contexts[context].show();
	else
	    contexts[context].hide();
    };
    contextActivate[target]();

    return false;
}

$(document).ready(function() {
    contexts = {
	input: $('#input'),
	play: $('#play'),
	log: $('#log')
    };
    switchNavigation('input');
    for(context in contexts)
	(function(target) {
	     $('#nav_' + context).click(function(ev) {
		 ev.preventDefault();
		 switchNavigation(target);
	     });
	     contextInit[target]();
	})(context);
});