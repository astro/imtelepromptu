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

var contextInit = {
    input: function() {
    },

    play: function() {
	$('#play_prev').click(function() {
	    setCurrentLine(Math.max(0, currentLine - 1));
	});
	$('#play_play').click(function() {
	    playing = !playing;
	    $('#play_play').text(playing ? "■" : "▶");
	    updateScrolling();
	});
	$('#play_next').click(function() {
	    setCurrentLine(Math.min(lines.length - 1, currentLine + 1));
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