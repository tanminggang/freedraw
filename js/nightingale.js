function loadHandlers(  ) {

    var home_button = document.getElementById("headerTag");
    home_button.onclick = function() { 
        location.href = "/"; 
    };  

}

var background_light = "#8030f0";
var background_dark = "#444444";

var right_back_light = "#6a3349";
var right_back_dark = "#444444";

var bottom_back_light = "#443388";
var bottom_back_dark = "#444444";

var right_light = "#401060";
var right_dark = "#000000";
var top_light = "#aa6afa";
var top_dark = "#666666";
var front_light = "#6626a6";        
var front_dark = "#222222";

var center_top_light = "#a030f0";
var center_top_dark = "#644444";
var center_bottom_light = "#771696";
var center_bottom_dark = "#442222";
var node1_light = "#b230f0";
var node1_dark = "#864444";
var node2_light = "#8230ff";
var node2_dark = "#664464";
var corner_node_1 = "#b230f0";
var corner_node_2 = "#864444";
var corner_node_3 = "#8230ff";
var corner_node_4 = "#664464";

var flipper = 0;

var x1 = 40; var y1 = 450;
var x2 = 100; var y2 = 400;
var x3 = 260; var y3 = 400;
var x4 = 200; var y4 = 450;

var x5 = 40; var y5 = 550;
var x6 = 200; var y6 = 550;

var x7 = 260; var y7 = 490;

function drawMindmap(  ) {



}

function drawWalls() {

    var back_cnvs = document.getElementById("backgroundCanvas");
    var back_cntxt = back_cnvs.getContext('2d');

    var wall_line_gradient = back_cntxt.createLinearGradient( 600, 400, 800, 600 );
    wall_line_gradient.addColorStop( 0, "#222222" );
    wall_line_gradient.addColorStop( 1, "#444444" );

    var wall_line_gradient_2 = back_cntxt.createLinearGradient( 600, 400, 0, 600 );
    wall_line_gradient_2.addColorStop( 0, "#222222" );
    wall_line_gradient_2.addColorStop( 1, "#444444" );

    back_cntxt.lineWidth = 3;
    back_cntxt.beginPath(  );
    back_cntxt.moveTo( 0, 100 );
    back_cntxt.lineTo( 600, 400 );
    back_cntxt.lineTo( 800, 0 );
    back_cntxt.strokeStyle = "#222222";
    back_cntxt.stroke(  );

    back_cntxt.beginPath(  );
    back_cntxt.moveTo( 600, 400 );
    back_cntxt.lineTo( 800, 600 );
    back_cntxt.strokeStyle = wall_line_gradient;
    back_cntxt.stroke(  );
    
    back_cntxt.beginPath(  );
    back_cntxt.moveTo( 600, 400 );
    back_cntxt.lineTo( 0, 600 );
    back_cntxt.strokeStyle = wall_line_gradient_2;
    back_cntxt.stroke(  );

}

function drawNodes() {

    var back_cnvs = document.getElementById("backgroundCanvas");
    var back_cntxt = back_cnvs.getContext('2d');

    back_cntxt.lineWidth = 2;
    back_cntxt.strokeStyle = "#ccccaa";

    var center_top_gradient = back_cntxt.createLinearGradient( 640, 440, 700, 500 );
    center_top_gradient.addColorStop( 0, center_top_light );
    center_top_gradient.addColorStop( 1, center_top_dark );
    
    var center_bottom_gradient = back_cntxt.createLinearGradient( 640, 440, 700, 500 );
    center_bottom_gradient.addColorStop( 0, center_bottom_light );
    center_bottom_gradient.addColorStop( 1, center_bottom_dark ); 
    
    var node1_gradient = back_cntxt.createLinearGradient( -30, 0, 30, 30 );
    node1_gradient.addColorStop( 0, node1_light );
    node1_gradient.addColorStop( 1, node1_dark );
    
    var node2_gradient = back_cntxt.createLinearGradient( -40, 0, 30, -30 );
    node2_gradient.addColorStop( 0, node2_light );
    node2_gradient.addColorStop( 1, node2_dark );  

    // four-part node
    var first_point_x = 540;
    var first_point_y = 370;
    var second_point_x = 620;
    var second_point_y = 360;
    var third_point_x = 635;
    var third_point_y = 435;
    var fourth_point_x = 534;
    var fourth_point_y = 422;

    var first_gradient = back_cntxt.createLinearGradient( 540, 340, 600, 400 );
    first_gradient.addColorStop( 0, front_light );
    first_gradient.addColorStop( 1, "#222222" );
    var second_gradient = back_cntxt.createLinearGradient( 600, 400, 635, 435 );
    second_gradient.addColorStop( 0, node1_light );
    second_gradient.addColorStop( 1, node1_dark );
    var third_gradient = back_cntxt.createLinearGradient( 600, 400, 635, 435 );
    third_gradient.addColorStop( 0, node2_light );
    third_gradient.addColorStop( 1, node2_dark );
    var fourth_gradient = back_cntxt.createLinearGradient( 540, 370, 580, 420 );
    fourth_gradient.addColorStop( 0, front_light );
    fourth_gradient.addColorStop( 1, "#666666" );

    back_cntxt.beginPath();
    back_cntxt.moveTo( first_point_x, first_point_y );
    back_cntxt.quadraticCurveTo( 580, 330, second_point_x, second_point_y );
    back_cntxt.stroke();
    back_cntxt.lineTo( 600, 400 );
    back_cntxt.lineTo( first_point_x, first_point_y );
    back_cntxt.fillStyle = first_gradient;
    back_cntxt.fill();
    back_cntxt.beginPath();
    back_cntxt.moveTo( second_point_x, second_point_y );
    back_cntxt.quadraticCurveTo( 660, 400, third_point_x, third_point_y );
    back_cntxt.stroke();
    back_cntxt.lineTo( 600, 400 );
    back_cntxt.lineTo( second_point_x, second_point_y );
    back_cntxt.fillStyle = second_gradient;
    back_cntxt.fill();
    back_cntxt.beginPath();
    back_cntxt.moveTo( third_point_x, third_point_y );
    back_cntxt.quadraticCurveTo( 580, 470, fourth_point_x, fourth_point_y );
    back_cntxt.stroke();
    back_cntxt.lineTo( 600, 400 );
    back_cntxt.lineTo( third_point_x, third_point_y );
    back_cntxt.fillStyle = third_gradient;
    back_cntxt.fill();
    back_cntxt.beginPath();
    back_cntxt.moveTo( fourth_point_x, fourth_point_y );
    back_cntxt.quadraticCurveTo( 500, 410, first_point_x, first_point_y );
    back_cntxt.stroke();
    back_cntxt.lineTo( 600, 400 );
    back_cntxt.lineTo( fourth_point_x, fourth_point_y );
    back_cntxt.fillStyle = fourth_gradient;
    back_cntxt.fill();

    // right-bottom wall node
    first_point_x = 650;
    first_point_y = 450;
    second_point_x = 695;
    second_point_y = 495;

    var center_top_gradient = 
        back_cntxt.createLinearGradient( first_point_x, first_point_y, second_point_x, second_point_y );
    center_top_gradient.addColorStop( 0, center_top_light );
    center_top_gradient.addColorStop( 1, center_top_dark );

    var center_bottom_gradient = 
        back_cntxt.createLinearGradient( first_point_x, first_point_y, second_point_x, second_point_y );
    center_bottom_gradient.addColorStop( 0, center_bottom_light );
    center_bottom_gradient.addColorStop( 1, center_bottom_dark ); 

    back_cntxt.beginPath();
    back_cntxt.moveTo( first_point_x, first_point_y );
    back_cntxt.quadraticCurveTo( 735, 330, second_point_x, second_point_y );
    back_cntxt.stroke();
    back_cntxt.moveTo( first_point_x, first_point_y );
    back_cntxt.lineTo( second_point_x, second_point_y );
    back_cntxt.fillStyle = center_top_gradient;
    back_cntxt.fill();

    back_cntxt.beginPath();
    back_cntxt.moveTo( second_point_x, second_point_y );
    back_cntxt.quadraticCurveTo( 520, 520, first_point_x, first_point_y );
    back_cntxt.stroke();
    back_cntxt.moveTo( first_point_x, first_point_y );
    back_cntxt.lineTo( second_point_x, second_point_y );
    back_cntxt.fillStyle = center_bottom_gradient;
    back_cntxt.fill();

    // right wall node
    back_cntxt.save();
    back_cntxt.translate( 720, 300 );
    back_cntxt.scale( 1, 1.2 );
    back_cntxt.rotate( Math.PI/6 + .13 );
    back_cntxt.scale( 0.6, 1 );
    back_cntxt.beginPath();
    back_cntxt.arc( 0, 0, 50, 0, Math.PI*2, false );
    back_cntxt.stroke();
    back_cntxt.fillStyle = node1_gradient;
    back_cntxt.fill();
    back_cntxt.closePath();
    back_cntxt.restore();

    // bottom wall node
    back_cntxt.save();
    back_cntxt.translate( 520, 550 );
    back_cntxt.scale( 1, 1 );
    back_cntxt.rotate( Math.PI*3/8 + .05 );
    back_cntxt.scale( 0.6, 1.1 );
    back_cntxt.beginPath();
    back_cntxt.arc( 0, 0, 50, 0, Math.PI*2, false );
    back_cntxt.stroke();
    back_cntxt.fillStyle = node2_gradient;
    back_cntxt.fill();
    back_cntxt.closePath();
    back_cntxt.restore();

}

function drawMovingBox(  ) {

    var back_cnvs = document.getElementById("backgroundCanvas");
    var back_cntxt = back_cnvs.getContext('2d');

    var gradient = back_cntxt.createLinearGradient( 0, 0, 300, 400 );
    gradient.addColorStop( 0, background_light );
    gradient.addColorStop( 1, background_dark );

    var top_gradient = back_cntxt.createLinearGradient( 100, 400, 200, 450 );
    top_gradient.addColorStop( 0, top_light );
    top_gradient.addColorStop( 1, top_dark );

    var front_gradient = back_cntxt.createLinearGradient( 40, 450, 180, 550 );
    front_gradient.addColorStop( 0, front_light );
    front_gradient.addColorStop( 1, front_dark );

    var right_gradient = back_cntxt.createLinearGradient( 210, 420, 250, 470 );
    right_gradient.addColorStop( 0, right_light );
    right_gradient.addColorStop( 1, right_dark );

    var wall_line_gradient_2 = back_cntxt.createLinearGradient( 600, 400, 0, 600 );
    wall_line_gradient_2.addColorStop( 0, "#222222" );
    wall_line_gradient_2.addColorStop( 1, "#444444" );

   if ( flipper == 0 ) {

        back_cntxt.fillStyle = gradient;
        back_cntxt.fillRect( 0, 300, 300, 300 );

        back_cntxt.lineWidth = 3;
        back_cntxt.beginPath();
        back_cntxt.moveTo( 0, 600 );
        back_cntxt.lineTo( 300, 500 );
        back_cntxt.strokeStyle = wall_line_gradient_2;
        back_cntxt.stroke();

    }

    back_cntxt.lineWidth = 4;

    // top
    back_cntxt.beginPath(  );
    back_cntxt.moveTo( x1, y1 );
    back_cntxt.quadraticCurveTo( x2, y2+20, x2, y2 );
    back_cntxt.quadraticCurveTo( x3-80, y3-20, x3, y3 );
    back_cntxt.quadraticCurveTo( x4+10, y4-30, x4, y4 );
    back_cntxt.quadraticCurveTo( x1+30, y1+10, x1, y1 );
    back_cntxt.strokeStyle = "#000000";
    back_cntxt.stroke(  );
    back_cntxt.fillStyle = top_gradient;
    back_cntxt.fill(  );  
    
    // front
    back_cntxt.beginPath(  );
    back_cntxt.moveTo( x5, y5 );
    back_cntxt.quadraticCurveTo( x1-20, y1+70, x1, y1 );
    back_cntxt.quadraticCurveTo( x4-130, y4+10, x4, y4 );
    back_cntxt.quadraticCurveTo( x6-10, y6-40, x6, y6 );
    back_cntxt.quadraticCurveTo( x5+120, y5+20, x5, y5 );
    back_cntxt.strokeStyle = "#000000";
    back_cntxt.stroke();
    back_cntxt.fillStyle = front_gradient;
    back_cntxt.fill();

    // right
    back_cntxt.beginPath();
    back_cntxt.moveTo( x3, y3 );
    back_cntxt.lineTo( x7, y7 );
    back_cntxt.quadraticCurveTo( x6+30, y6-50, x6, y6 );
    back_cntxt.quadraticCurveTo( x4-10, y4+60, x4, y4 );
    back_cntxt.quadraticCurveTo( x3-50, y3+20, x3, y3 );
    back_cntxt.strokeStyle = "#000000";
    back_cntxt.stroke(  );
    back_cntxt.fillStyle = right_gradient;
    back_cntxt.fill(  );

    flipper += 1;

    if ( flipper > 7 ) {

        flipper = 0;

    }

    if ( flipper == 0 ) {

        x1 = 40; y1 = 450;
        x2 = 100; y2 = 400;
        x3 = 260; y3 = 400;
        x4 = 200; y4 = 450;
        
        x5 = 40; y5 = 550;
        x6 = 200; y6 = 550;
        
        x7 = 260; y7 = 490;

    } else if ( flipper == 1 ) {

        x1 = 45; y1 = 445;
        x2 = 95; y2 = 405;
        x3 = 265; y3 = 405;
        x4 = 195; y4 = 445;
        
        x5 = 40; y5 = 550;
        x6 = 205; y6 = 550;
        
        x7 = 260; y7 = 485;

    } else if (flipper == 2 ) {

        x1 = 50; y1 = 450;
        x2 = 90; y2 = 400;
        x3 = 265; y3 = 390;
        x4 = 200; y4 = 450;
        
        x5 = 30; y5 = 545;
        x6 = 200; y6 = 570;
        
        x7 = 265; y7 = 480;

    } else if ( flipper == 3 ) {

        x1 = 45; y1 = 455;
        x2 = 95; y2 = 405;
        x3 = 260; y3 = 395;
        x4 = 195; y4 = 450;
        
        x5 = 35; y5 = 550;
        x6 = 205; y6 = 545;
        
        x7 = 260; y7 = 480;

    } else if ( flipper == 4 ) {

        x1 = 40; y1 = 455;
        x2 = 100; y2 = 400;
        x3 = 250; y3 = 400;
        x4 = 210; y4 = 455;
        
        x5 = 40; y5 = 550;
        x6 = 190; y6 = 550;
        
        x7 = 260; y7 = 495;

    } else if ( flipper == 5 ) {

        x1 = 40; y1 = 450;
        x2 = 110; y2 = 390;
        x3 = 260; y3 = 405;
        x4 = 205; y4 = 450;
        
        x5 = 35; y5 = 550;
        x6 = 195; y6 = 550;
        
        x7 = 265; y7 = 490;

    } else if ( flipper == 6 ) {

        x1 = 40; y1 = 455;
        x2 = 100; y2 = 402;
        x3 = 259; y3 = 400;
        x4 = 201; y4 = 450;
        
        x5 = 42; y5 = 553;
        x6 = 190; y6 = 550;
        
        x7 = 260; y7 = 490;

    } else if ( flipper == 7 ) {

        x1 = 41; y1 = 460;
        x2 = 100; y2 = 400;
        x3 = 267; y3 = 395;
        x4 = 202; y4 = 450;
        
        x5 = 43; y5 = 550;
        x6 = 200; y6 = 550;
        
        x7 = 260; y7 = 490;

    }

    setTimeout( drawMovingBox, 250 );

}

var gradient_offset = 0;
var direction_flag = 0;

function drawBackground() {

    var back_cnvs = document.getElementById("backgroundCanvas");
    var back_cntxt = back_cnvs.getContext('2d');

    var gradient = back_cntxt.createLinearGradient( 0, 0, 300+150-(gradient_offset*3*50), 400+200-(gradient_offset*4*50) );
    gradient.addColorStop( 0.0+(gradient_offset/1.5), background_light );
    gradient.addColorStop( 1.0-(gradient_offset/1.5), background_dark );
    back_cntxt.fillStyle = gradient;
    back_cntxt.fillRect( 0, 0, back_cnvs.width, back_cnvs.height );

    setTimeout( drawBackground, 100 );

}

function drawFraming() {

    var right_cnvs = document.getElementById("rightCanvas");
    var right_cntxt = right_cnvs.getContext('2d');
    var right_gradient = right_cntxt.createLinearGradient( 0, 
			400, 
			200, 
			400 );

    right_gradient.addColorStop( 0.0+(gradient_offset), right_back_light );
    right_gradient.addColorStop( 1.0-gradient_offset, right_back_dark );
    right_cntxt.fillStyle = right_gradient;
    right_cntxt.fillRect( 0, 0, 200, 1000 );

    var bottom_cnvs = document.getElementById("bottomCanvas");
    var bottom_cntxt = bottom_cnvs.getContext('2d');
    var bottom_gradient = bottom_cntxt.createLinearGradient( 500,
			0+gradient_offset, 
			500, 
			60+gradient_offset );

    bottom_gradient.addColorStop( 0.0+gradient_offset, bottom_back_light );
    bottom_gradient.addColorStop( 1.0-gradient_offset, bottom_back_dark );
    bottom_cntxt.fillStyle = bottom_gradient;
    bottom_cntxt.fillRect( 0, 0, 800, 60 );

	if ( direction_flag == 0 ) {

		gradient_offset += 0.007;

	} else if ( direction_flag == 1 ) {

		gradient_offset -= 0.007;

	}

	if ( gradient_offset > 0.43 ) {

		direction_flag = 1;
		gradient_offset = 0.43;

	} else if (gradient_offset < 0.0 ) {

		direction_flag = 0;
		gradient_offset = 0.0;

	}

    setTimeout( drawFraming, 100 );

}
