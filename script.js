var contexts; /* input, play, log jQuery */

var currentLine = 0;
var lines = [];
var playing = true;

function setCurrentLine(line) {
    if (playing) {
    }
}

var contextInit = {
    input: function() {
    },

    play: function() {
	$('#play_prev').click(function() {
	    setCurrentLine(Math.max(0, currentLine - 1));
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
	lines = textarea.val().split(/\n/);
	var el = contexts.play.find('.lines');
	el.empty();
	lines.forEach(function(line) {
	    var p = $('<p class="line"></p>');
	    p.text(line);
	    el.append(p);
	});
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