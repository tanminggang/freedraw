// freedraw
// toimawb
// vijay rudraraju
// june 7 2011

var canvas, context;
var image_buffer;
var fill_change_buffer;

// 0 -> quadratic
// 1 -> scribble
var stroke_mode = 0;
// 0 -> no fill
// 1 -> fill
// 2 -> gradient fill
var fill_mode = 0;

var stroke_color = '#ff0000';
var fill_color = '#0000ff';


var doodle = {
	// Define some variables
	'drawing':			false,
	'linethickness':	1,
	'newID':			'#clear',

};
doodle.init = function() {

	// Mouse based interface
	$(doodle.canvas).bind('mousedown', doodle.drawStart);
	$(doodle.canvas).bind('mousemove', doodle.draw);
	$(doodle.canvas).bind('mouseup', doodle.drawEnd);
	$('body').bind('mouseup', doodle.drawEnd);

	// Add clear canvas event
	$(doodle.newID).bind('click', doodle.newDoodle);

}
doodle.destroy = function() {

	// Mouse based interface
	$(doodle.canvas).unbind('mousedown', doodle.drawStart);
	$(doodle.canvas).unbind('mousemove', doodle.draw);
	$(doodle.canvas).unbind('mouseup', doodle.drawEnd);
	$('body').unbind('mouseup', doodle.drawEnd);

	// Add clear canvas event
	$(doodle.newID).unbind('click', doodle.newDoodle);

}
doodle.newDoodle = function() {

	doodle.clearCanvas();

}
doodle.clearCanvas = function(  ) {

	// Clear existing drawing
	doodle.context.clearRect(0, 0, doodle.canvas.width, doodle.canvas.height);
	doodle.canvas.width = doodle.canvas.width;

	// Set the background to white.
	// then reset the fill style back to black
	doodle.context.fillStyle = '#bbbbbb';
	doodle.context.fillRect(0, 0, doodle.canvas.width, doodle.canvas.height);
	doodle.context.fillStyle = '#000000';

	doodle.updating = false;
}
doodle.drawStart = function( ev ) {

	ev.preventDefault();
	if ( ev.target.id != "editorCanvas" ||
		 stroke_mode != 1 ) {
		return;
	}
	// Calculate the current mouse X, Y coordinates with canvas offset
	var x, y;
	x = ev.pageX - $(doodle.canvas).offset().left;
	y = ev.pageY - $(doodle.canvas).offset().right;
	doodle.drawing = true;
	doodle.context.lineWidth = doodle.linethickness;

	// Store the current x, y positions
	doodle.oldX = x;
	doodle.oldY = y;

	doodle.context.beginPath(  );
    $('#editorTextArea').val($('#editorTextArea').val()+sprintf( "context.beginPath(  );\n" ));

}
doodle.draw = function( ev ) {

	if ( ev.target.id != "editorCanvas" ||
		 stroke_mode != 1 ) {
		return;
	}

	// Calculate the current mouse X, Y coordinates with canvas offset
	var x, y;
	x = ev.pageX - $(doodle.canvas).offset().left;
	y = ev.pageY - $(doodle.canvas).offset().top;

	// If the mouse is down (drawing) then start drawing lines
	doodle.context.strokeStyle = stroke_color;
	doodle.context.fillStyle = fill_color;

	if ( doodle.drawing ) {

		doodle.context.moveTo( doodle.oldX, doodle.oldY );
		doodle.context.lineTo( x, y );
		doodle.context.stroke(  );

        $('#editorTextArea').val($('#editorTextArea').val()+sprintf( "context.moveTo( %d, %d );\n", doodle.oldX, doodle.oldY ));
        $('#editorTextArea').val($('#editorTextArea').val()+sprintf( "context.lineTo( %d, %d );\n", x, y ));
        $('#editorTextArea').val($('#editorTextArea').val()+sprintf( "context.stroke(  );\n" ));

	}

	// Store the current X, Y position
	doodle.oldX = x;
	doodle.oldY = y;

}
// Finished drawing (mouse up)
doodle.drawEnd = function( ev ) {

	doodle.drawing = false;
	if ( ev.target.id != "editorCanvas" ||
		 stroke_mode != 1 ) {
		return;
	}

    $('#editorTextArea').val($('#editorTextArea').val()+sprintf( "\n" ));

}

//var textarea;
var picker;
var fill_picker;
var gradient_picker;
var gradientCanvas;
var gradientContext;
var gradient_stops = new Array(  ); 

function init() {

	doodle.init(  );

	//textarea = document.getElementById('editorTextArea');
	picker = document.getElementById('picker');
	fill_picker = document.getElementById('fill_picker');
	gradient_picker = document.getElementById('gradient_picker');
	gradientCanvas = document.getElementById('gradientCanvas');
	gradientContext = gradientCanvas.getContext('2d');
	
	gradientContext.fillStyle = '#eeeeee';
	gradientContext.fillRect(0, 0, gradientCanvas.width, gradientCanvas.height);

	stroke_color = picker.value;
	fill_color = fill_picker.value;

	canvas = document.getElementById('editorCanvas');
	if (!canvas) {
		alert('Error: I cannot find the canvas element!');
		return;
	}

	if (!canvas.getContext) {
		alert('Error: no canvas.getContext!');
		return;
	}

	context = canvas.getContext('2d');
	if (!context) {
		alert('Error: failed to getContext!');
		return;
	}


	// Collect elements from the DOM and set-up the canvas
	doodle.canvas = $('#editorCanvas')[0];
	doodle.context = doodle.canvas.getContext('2d');

    clear();

	context.lineWidth = 1;
	image_buffer = context.createImageData( canvas.width, canvas.height );

	canvas.addEventListener( 'click', canvas_click_handler, false );

	document.getElementById('noFill').addEventListener( 'click', noFill_click, false );
	document.getElementById('fill').addEventListener( 'click', fill_click, false );
	document.getElementById('gradient').addEventListener( 'click', gradient_click, false );
	document.getElementById('addStop').addEventListener( 'click', addStop_click, false );
	document.getElementById('clearGradient').addEventListener( 'click', clearGradient_click, false );

	document.getElementById('clear').addEventListener( 'mousedown', clear_mousedown, false );
	document.getElementById('clear').addEventListener( 'mouseup', clear_mouseup, false );

	document.getElementById('picker').addEventListener( 'mousedown', picker_mousedown, false );
	document.getElementById('fill_picker').addEventListener( 'mousedown', picker_mousedown, false );
    $('#point').click(point_click);
	document.getElementById('quadratic').addEventListener( 'click', quadratic_click, false );
	document.getElementById('scribble').addEventListener( 'click', scribble_click, false );

	document.getElementById('execute').addEventListener( 'click', execute_click, false );

	document.body.addEventListener( 'click', catchall_click_handler, false );

	document.getElementById('quadratic').style.backgroundColor = '#ffbbaa';
	document.getElementById('fill').style.backgroundColor = '#ffbbaa';

	fill_mode = 1;

}

function canvas_click_handler( ev ) {

	if ( stroke_mode == 0 ) {

	  	canvas_quadratic( ev );

	} else if ( stroke_mode == 1 ) {

		canvas_scribble( ev );

	}

}

function catchall_click_handler( ev ) {

	if ( ev.target.className != "color 0" &&
		 ev.target.className != "color 1" &&
		 ev.target.className != "color 2" &&
		 ev.target.className != "mousepad" ) {
		var jcs = jscolor.jscolor.style;
		jcs.display = 'none';
	}

	if ( stroke_color != picker.value.toLowerCase() ) {

		stroke_color = picker.value;
        $('#editorTextArea').val($('#editorTextArea').val()+sprintf("context.strokeStyle = \"%s\";\n", stroke_color));

	}

	if ( fill_color != fill_picker.value.toLowerCase() ) {

		fill_color = fill_picker.value;
		//textarea.innerHTML += sprintf("context.fillStyle = \"%s\";\n", fill_color);
        $('#editorTextArea').val($('#editorTextArea').val()+sprintf("context.fillStyle = \"%s\";\n", fill_color));

	}

}
function picker_mousedown( ev ) {

	event.preventDefault(  );

}

function noFill_click( ev ) {

	event.preventDefault();

	fill_mode = 0;
	document.getElementById('noFill').style.backgroundColor = '#ffbbaa';
	document.getElementById('fill').style.backgroundColor = '#bbaaff';
	document.getElementById('gradient').style.backgroundColor = '#bbaaff';

}

function fill_click( ev ) {

	event.preventDefault();

	fill_mode = 1;
	fill_color = fill_picker.value;

	document.getElementById('noFill').style.backgroundColor = '#bbaaff';
	document.getElementById('fill').style.backgroundColor = '#ffbbaa';
	document.getElementById('gradient').style.backgroundColor = '#bbaaff';

}

function gradient_click( ev ) {

	event.preventDefault();

	fill_mode = 2;
	fill_color = gradient;

	document.getElementById('noFill').style.backgroundColor = '#bbaaff';
	document.getElementById('fill').style.backgroundColor = '#bbaaff';
	document.getElementById('gradient').style.backgroundColor = '#ffbbaa';

}

function execute_click( ev ) {

    execute();

}
function execute() {

	event.preventDefault();
	doodle.clearCanvas();
	context.save();
    window.eval( $('#editorTextArea').val() );
	context.restore();

}

function quadratic_click( ev ) {

	event.preventDefault();
	stroke_mode = 0;
	document.getElementById('quadratic').style.backgroundColor = '#ffbbaa';
	document.getElementById('scribble').style.backgroundColor = '#bbaaff';
	document.getElementById('clear').style.backgroundColor = '#bbaaff';
	doodle.destroy(  );

}

function addStop_click( ev ) {

	event.preventDefault();

	gradient_stops.push( gradient_picker.value );

	var gradient = gradientContext.createLinearGradient( 0, 0, 200, 0 );
	for ( var i=0; i<gradient_stops.length; i++ ) {

		if ( i == 0 ) {

			gradient.addColorStop( 0.0, gradient_stops[0] );

		} else {

			gradient.addColorStop( i*(1.0/(gradient_stops.length-1)), gradient_stops[i] );

		}

	}

	gradientContext.fillStyle = gradient;
	gradientContext.fillRect( 0, 0, gradientCanvas.width, gradientCanvas.height );

}

function clearGradient_click( ev ) {

	event.preventDefault();

	gradient_stops.length = 0;

	gradientContext.fillStyle = '#eeeeee';
	gradientContext.fillRect( 0, 0, gradientCanvas.width, gradientCanvas.height );

}

function scribble_click( ev ) {

	event.preventDefault();
	stroke_mode = 1;
	document.getElementById('scribble').style.backgroundColor = '#ffbbaa';
	document.getElementById('quadratic').style.backgroundColor = '#bbaaff';
	document.getElementById('clear').style.backgroundColor = '#bbaaff';
	doodle.init(  );

}
function clear_mousedown( ev ) {

	event.preventDefault();
	document.getElementById('clear').style.backgroundColor = '#ffbbaa';

}
function clear_mouseup( ev ) {

	event.preventDefault(  );
	document.getElementById('clear').style.backgroundColor = '#bbaaff';

}
function clear() {

	doodle.clearCanvas(  );

    $('#editorTextArea').val("");
    $('#editorTextArea').val($('#editorTextArea').val()+"var canvas = document.getElementById('editorCanvas');\n");
    $('#editorTextArea').val($('#editorTextArea').val()+"var context = canvas.getContext('2d');\n");
    $('#editorTextArea').val($('#editorTextArea').val()+"context.lineWidth = 1;\n\n");
    $('#editorTextArea').val($('#editorTextArea').val()+sprintf("context.strokeStyle = \"%s\";\n", stroke_color));
    $('#editorTextArea').val($('#editorTextArea').val()+sprintf("context.fillStyle = \"%s\";\n\n", fill_color));

}

function canvas_mousedown( ev ) {

	event.preventDefault();
	canvas.addEventListener( 'mousemove', canvas_scribble, false );

}
function canvas_mouseup( ev ) {

	canvas.removeEventListener('mousemove', canvas_scribble, false);

}

var quadratic_stage = 0;
var points = new Array(  ); 
var adj_x = 0;
var adj_y = 0;

function Point( x, y ) {
	this.x = x;
	this.y = y;
}

function canvas_quadratic( ev ) {

	if ( stroke_mode != 0 ) {

		return;

	}

	var x, y;

	if (ev.layerX || ev.layerX == 0) {
		x = ev.layerX;
		y = ev.layerY;
	} else if (ev.offsetX || ev.offsetX == 0) {
		x = ev.offsetX;
		y = ev.offsetY;
	}

	context.strokeStyle = stroke_color;
	context.fillStyle = fill_color;

	if ( quadratic_stage == 0 ) {

		image_buffer = context.getImageData( 0, 0, canvas.width, canvas.height );		
		fill_chain_buffer = context.getImageData( 0, 0, canvas.width, canvas.height );		
		
		var len = points.length;
		for ( var i=0; i<len; i++ ) {

			points.pop(  );

		}

		context.beginPath(  );
		context.arc( x, y, 2, 0, 2*Math.PI, true );
		context.fill(  );
		context.stroke(  );

		context.beginPath(  );
		context.moveTo( x, y );

		quadratic_stage = 1;
		
		points.push( new Point(x, y) );

	} else if ( quadratic_stage == 1 ) {

		canvas.removeEventListener( 'mousemove', highlight_origin, false );

		if ( fill_mode == 0 || points.length == 1 ) {

			context.clearRect( 0, 0, canvas.width, canvas.height );
			context.putImageData( image_buffer, 0, 0 );

			context.quadraticCurveTo( points[0].x,
					points[0].y,
					x,
					y );
			context.stroke( );

			canvas.addEventListener( 'mousemove', canvas_quadratic_modify, false );

			quadratic_stage = 2;

			points.push( new Point(x, y) );
			points.push( new Point(0, 0) );

		} else if ( fill_mode == 1 || fill_mode == 2 ) {

			if ( fill_flag == 1 ) {

				x = adj_x;
				y = adj_y;

			}

			image_buffer = context.getImageData( 0, 0, canvas.width, canvas.height );		
			context.clearRect( 0, 0, canvas.width, canvas.height );
			context.putImageData( image_buffer, 0, 0 );

			context.beginPath(  );
			context.moveTo( points[points.length-2].x, points[points.length-2].y );
			context.quadraticCurveTo( points[points.length-2].x,
					points[points.length-2].y,
					x,
					y );
			context.stroke( );

			canvas.addEventListener( 'mousemove', canvas_quadratic_modify, false );

			quadratic_stage = 2;

			points.push( new Point(x, y) );
			points.push( new Point(x, y) );

		}

	} else if ( quadratic_stage == 2 ) {

		if ( fill_mode == 0 ) {

			quadratic_stage = 0;

            $('#editorTextArea').val($('#editorTextArea').val()+sprintf( "context.beginPath(  );\n" ));
            $('#editorTextArea').val($('#editorTextArea').val()+sprintf( "context.moveTo( %d, %d );\n", points[0].x, points[0].y ));
            $('#editorTextArea').val($('#editorTextArea').val()+sprintf( "context.quadraticCurveTo( %d, %d, %d, %d );\n", points[2].x, points[2].y, points[1].x, points[1].y ));
            $('#editorTextArea').val($('#editorTextArea').val()+sprintf( "context.stroke(  );\n\n" ));

		} else if ( fill_mode == 1 ) {

			quadratic_stage = 1;

			if ( fill_flag == 0 ) {

				canvas.addEventListener( 'mousemove', highlight_origin, false );

			} else if ( fill_flag == 1 ) {

				handle_last_stage_click( ev );

			}

		} else if ( fill_mode == 2 ) {

			quadratic_stage = 1;

			if ( fill_flag == 0 ) {

				canvas.addEventListener( 'mousemove', highlight_origin, false );

			} else if ( fill_flag == 1 ) {

				gradient_stage = 0;
				//pick_gradient_direction( ev );

				canvas.removeEventListener( 'click', canvas_click_handler, false );
				canvas.addEventListener( 'click', pick_gradient_direction, false );

			}

		}

		image_buffer = context.getImageData( 0, 0, canvas.width, canvas.height );		
		canvas.removeEventListener( 'mousemove', canvas_quadratic_modify, false );

	}

}

var fill_flag = 0;

function handle_last_stage_click( ev ) {

	context.clearRect( 0, 0, canvas.width, canvas.height );
	context.putImageData( fill_chain_buffer, 0, 0 );

	context.beginPath(  );
	context.moveTo( points[0].x, points[0].y );

	for ( var i=0; i<(points.length-1)/2; i++ ) {

		context.quadraticCurveTo( points[(i*2)+2].x,
				points[(i*2)+2].y,
				points[(i*2)+1].x,
				points[(i*2)+1].y );

	}

	if ( fill_mode == 2 ) {

		context.fillStyle = fill_gradient;

	}

	context.fill(  );
	context.stroke(  );

    $('#editorTextArea').val($('#editorTextArea').val()+sprintf( "context.beginPath(  );\n" ));
    $('#editorTextArea').val($('#editorTextArea').val()+sprintf( "context.moveTo( %d, %d );\n", points[0].x, points[0].y ));
	
	for ( var i=0; i<(points.length-1)/2; i++ ) {
        $('#editorTextArea').val($('#editorTextArea').val()+sprintf( "context.quadraticCurveTo( %d, %d, %d, %d );\n", points[(i*2)+2].x, points[(i*2)+2].y, points[(i*2)+1].x, points[(i*2)+1].y ));
	}

    $('#editorTextArea').val($('#editorTextArea').val()+sprintf( "context.fill(  );\n" ));
    $('#editorTextArea').val($('#editorTextArea').val()+sprintf( "context.stroke(  );\n\n" ));

	quadratic_stage = 0;
	fill_flag = 0;
	canvas.addEventListener( 'click', canvas_click_handler, false );

}

var gradient_stage = 0;
var gradient_point_1 = new Point( 0, 0 );
var gradient_point_2 = new Point( 0, 0 );
var fill_gradient;

function pick_gradient_direction( ev ) {

	if ( fill_mode != 2 ) {

		return;

	}

	var x, y;

	if (ev.layerX || ev.layerX == 0) {
		x = ev.layerX;
		y = ev.layerY;
	} else if (ev.offsetX || ev.offsetX == 0) {
		x = ev.offsetX;
		y = ev.offsetY;
	}

	context.strokeStyle = stroke_color;
	context.fillStyle = fill_color;

	if ( gradient_stage == 0 ) {

		context.beginPath(  );
		context.arc( x, y, 2, 0, 2*Math.PI, true );
		context.fill(  );
		context.stroke(  );

		context.beginPath(  );
		context.moveTo( x, y );

		gradient_point_1.x = x;
		gradient_point_1.y = y;

		gradient_stage = 1;

	} else if ( gradient_stage == 1 ) {
		
		context.lineTo( x, y );
		context.stroke(  );

		gradient_point_2.x = x;
		gradient_point_2.y = y;

		fill_gradient = context.createLinearGradient( 
				gradient_point_1.x, 
				gradient_point_1.y, 
				gradient_point_2.x,
				gradient_point_2.y );
		for ( var i=0; i<gradient_stops.length; i++ ) {

			if ( i == 0 ) {

				fill_gradient.addColorStop( 0.0, gradient_stops[0] );

			} else {

				fill_gradient.addColorStop( i*(1.0/(gradient_stops.length-1)), gradient_stops[i] );

			}

		}

		gradient_stage = 0;

		handle_last_stage_click( ev );

		canvas.addEventListener( 'click', canvas_click_handler, false );
		canvas.removeEventListener( 'click', pick_gradient_direction, false );

	} 

}

function highlight_origin( ev ) {

	var x, y;
	var length = points.length;

	if (ev.layerX || ev.layerX == 0) {
		x = ev.layerX;
		y = ev.layerY;
	} else if (ev.offsetX || ev.offsetX == 0) {
		x = ev.offsetX;
		y = ev.offsetY;
	}

	if ( Math.abs(x - points[0].x) < 5 && Math.abs(y - points[0].y) < 5 ) {

		context.beginPath(  );
		context.arc( points[0].x, points[0].y, 3, 0, 2*Math.PI, true );
		context.fill(  );
		context.stroke(  );
		fill_flag = 1;
		adj_x = points[0].x;
		adj_y = points[0].y;

	} else {

		context.clearRect( 0, 0, canvas.width, canvas.height );
		context.putImageData( image_buffer, 0, 0 );
		fill_flag = 0;

	}

}

function canvas_quadratic_modify( ev ) {

	var x, y;
	var length = points.length;

	if (ev.layerX || ev.layerX == 0) {
		x = ev.layerX;
		y = ev.layerY;
	} else if (ev.offsetX || ev.offsetX == 0) {
		x = ev.offsetX;
		y = ev.offsetY;
	}

	context.clearRect( 0, 0, canvas.width, canvas.height );
	context.putImageData( image_buffer, 0, 0 );

	if ( fill_mode == 0 || points.length == 3 ) {

		context.beginPath( );
		context.moveTo( points[0].x, points[0].y );
		context.quadraticCurveTo( x,
				y,
				points[1].x,
				points[1].y );
		context.stroke( );

		points[2].x = x;
		points[2].y = y;

	} else if ( fill_mode == 1 || fill_mode == 2 ) {

		context.beginPath( );
		context.moveTo( points[length-4].x, points[length-4].y );
		context.quadraticCurveTo( x,
				y,
				points[length-2].x,
				points[length-2].y );
		context.stroke( );

		points[length-1].x = x;
		points[length-1].y = y;

	}

}

var started = false;

function canvas_scribble( ev ) {

	var x, y;

	if (ev.layerX || ev.layerX == 0) {
		x = ev.layerX;
		y = ev.layerY;
	} else if (ev.offsetX || ev.offsetX == 0) {
		x = ev.offsetX;
		y = ev.offsetY;
	}

	if (!started) {
		context.beginPath();
		context.moveTo(x, y);
		started = true;
	} else {
		context.lineTo(x, y);
		context.stroke();
	}

}
