// freedraw
// toimawb
// vijay rudraraju
// may 27 2011

Object.prototype.clone = function() {
    var newObj = (this instanceof Array) ? [] : {};
    for (i in this) {
        if (i == 'clone') continue;
        if (this[i] && typeof this[i] == "object") {
            newObj[i] = this[i].clone();
        } else newObj[i] = this[i]
    } return newObj;
};

var screenWidth = 1280;
var screenHeight = 800;
var mX = 0; 
var mY = 0;
var drawCounter = 0;

function globalP(p) {
	p.mouseMoved = function() {
		mX = p.mouseX;
		mY = p.mouseY;
	};

	p.mouseClicked = function() {
	};

	p.setup = function() {
		//p.println(p.PFont.list());

		p.size(screenWidth,screenHeight);
		var font = p.loadFont("monospace");
		p.textFont(font);
	};

	p.draw = function() {
        p.background(70);
        updateInputTree();
        drawInputTree();
		drawCounter++;
		drawCounter = drawCounter % 240;
	};
}

var p;
var symbols = {};
$(document).ready(function() {
		p = new Processing($('#globalCanvas')[0], globalP);

        //alpha.a.path = p.line;
        //alpha.b.path = p.bezier;

        initSymbols();
        initDivClickHandlers();
        initCharSelectHandler();
});

function initSymbols() {
    var symbolIndices = $('#charSelect').children().map(function() {
            return this.innerHTML; 
            });
    for (var i=0;i<symbolIndices.length;i++) {
        symbols[symbolIndices[i]] = {};
        symbols[symbolIndices[i]].code = "";
        symbols[symbolIndices[i]].code += "var canvas = document.getElementById('editorCanvas');\n";
        symbols[symbolIndices[i]].code += "var context = canvas.getContext('2d');\n";
        symbols[symbolIndices[i]].code += "context.lineWidth = 1;\n\n";
        symbols[symbolIndices[i]].code += sprintf("context.strokeStyle = \"%s\";\n", stroke_color);
        symbols[symbolIndices[i]].code += sprintf("context.fillStyle = \"%s\";\n\n", fill_color);
    }
}

//var eventStore;
function initCharSelectHandler() {
    this.lastVal = 'a';
    $('#charSelect').change(function(thisEvent) {
            var index = $('#charSelect').val();
            saveLastChar();
            $('#editorTextArea').val(symbols[index].code.replace("globalCanvas","editorCanvas"));
            lastVal = index;
            execute();
            });
}
function saveLastChar() {
    symbols[lastVal].code = $('#editorTextArea').val().replace("editorCanvas","globalCanvas");
}

function initDivClickHandlers() {
    $('#globalCanvas').toggle(true);
    $('#editClosedText').toggle(true);
    $('#editorCanvas').toggle(false);
    $('#editorTextArea').toggle(false);
    $('#buttonTable').toggle(false);
    $('#charSelect').toggle(false);
    $('#editOpenText').toggle(false);

    $('#editCharacterSwitch').click(function() {
            $('#globalCanvas').toggle();
            $('#editorCanvas').toggle();
            $('#editorTextArea').toggle();
            $('#buttonTable').toggle();
            $('#charSelect').toggle();
            $('#editCharacterSwitch').toggleClass('editClosed');
            $('#editCharacterSwitch').toggleClass('editOpen');
            $('#editClosedText').toggle();
            $('#editOpenText').toggle();

            saveLastChar();
            });
}

//var alpha = {};
/*
alpha.a = {path1:0,
    path2:0,
    path3:1,
    path4:1,
    num:0};
alpha.A = alpha.a.clone();
alpha.A.isCapital = true;
alpha.b = {path1:0,
    path2:0,
    path3:0.25,
    path4:0.25,
    path5:0.75,
    path6:0.75,
    path7:1,
    path8:1,
    num:1};
alpha.B = alpha.b.clone();
alpha.B.isCapital = true;
alpha.c = {path1:0,
    path2:0,
    path3:1,
    path4:1,
    num:2};
alpha.C = alpha.c.clone();
alpha.C.isCapital = true;
alpha.d = {path1:0,
    path2:0,
    path3:1,
    path4:1,
    num:3};
alpha.D = alpha.d.clone();
alpha.D.isCapital = true;
alpha.e = {path1:0,
    path2:0,
    path3:1,
    path4:1,
    num:4};
alpha.E = alpha.e.clone();
alpha.E.isCapital = true;
*/

var activeText = "";
var inputTree = [];
function updateInputTree() {
	activeText = $('#input').val();
    inputTree = activeText.split('.');
    for (var i=0;i<inputTree.length;i++) {
        inputTree[i] = inputTree[i].split(' ');
    }
}

function drawInputTree() {
    p.stroke(255);
    p.noFill();
    
    drawParagraph(inputTree);
}

function drawParagraph(input) {
    for (var i=0;i<input.length;i++) {
        if (input[i] == "") {
            continue;
        }

        if (i==0) {
            drawPhrase(input[0]);
        }
    }
}

function drawPhrase(input) {
    for (var i=0;i<input.length;i++) {
        if (input[i] == "") {
            continue;
        }

        drawWord(input[i]);
    }
}

function drawWord(input) {
    var scaleX = 1;
    var scaleY = 1;

    var posX = 0;
    var posY = 0;

    var iCorrection = 0;
    var trueI = 0;

    for (var i=0;i<input.length;i++) {
        //p.println(symbols[input[i]].code);
        window.eval(symbols[input[i]].code);
        /*
        trueI = i+iCorrection;
        switch(trueI) {
            case 1:
                scaleX = alpha[input[i]].num;
                break;
            case 2:
                scaleX += 26 * alpha[input[i]].num;
                break;
            case 3:
                scaleX += 26*26 * alpha[input[i]].num;
                break;
            case 4:
                scaleX += 26*26*26 * alpha[input[i]].num;
                break;
            case 5:
                scaleY = alpha[input[i]].num;
                break;
            case 6:
                scaleY += 26 * alpha[input[i]].num;
                break;
            case 7:
                scaleY += 26*26 * alpha[input[i]].num;
                break;
            case 8:
                scaleY += 26*26*26 * alpha[input[i]].num;
                break;
            case 9:
                posX = alpha[input[i]].num;
                break;
            case 10:
                posX += 26 * alpha[input[i]].num;
                break;
            case 11:
                posX += 26*26 * alpha[input[i]].num;
                break;
            case 12:
                posX += 26*26*26 * alpha[input[i]].num;
                break;
            case 13:
                posY = alpha[input[i]].num;
                break;
            case 14:
                posY += 26 * alpha[input[i]].num;
                break;
            case 15:
                posY += 26*26 * alpha[input[i]].num;
                break;
            case 16:
                posY += 26*26*26 * alpha[input[i]].num;
                break;
        }
        if (alpha[input[i]].isCapital && i>0) {
            if (trueI<5) {
                iCorrection = 4-trueI;
            } else if (trueI<8) {
                iCorrection += 8-trueI;
            } else if (trueI<12) {
                iCorrection += 12-trueI;
            }
        }
        */
    }

/*
    alpha[input[0]].path(alpha[input[0]].path1+posX,
            alpha[input[0]].path2+posY,
            alpha[input[0]].path3*10*scaleX+posX,
            alpha[input[0]].path4*10*scaleY+posY);
    */

}

/*
function drawInputTree() {
    p.stroke(255);
    p.noFill();

    for (var i=0;i<inputTree.length;i++) {
        if (inputTree[i] == "") {
            continue;
        }
        var scaleX = 1;
        var scaleY = 1;

        var posX = 0;
        var posY = 0;

        var jCorrection = 0;
        var trueJ = 0;

        for (var j=0;j<inputTree[i].length;j++) {
            trueJ = j+jCorrection;
            switch(trueJ) {
                case 1:
                    scaleX = alpha[inputTree[i][j]].num;
                    break;
                case 2:
                    scaleX += 26 * alpha[inputTree[i][j]].num;
                    break;
                case 3:
                    scaleX += 26*26 * alpha[inputTree[i][j]].num;
                    break;
                case 4:
                    scaleX += 26*26*26 * alpha[inputTree[i][j]].num;
                    break;
                case 5:
                    scaleY = alpha[inputTree[i][j]].num;
                    break;
                case 6:
                    scaleY += 26 * alpha[inputTree[i][j]].num;
                    break;
                case 7:
                    scaleY += 26*26 * alpha[inputTree[i][j]].num;
                    break;
                case 8:
                    scaleY += 26*26*26 * alpha[inputTree[i][j]].num;
                    break;
                case 9:
                    posX = alpha[inputTree[i][j]].num;
                    break;
                case 10:
                    posX += 26 * alpha[inputTree[i][j]].num;
                    break;
                case 11:
                    posX += 26*26 * alpha[inputTree[i][j]].num;
                    break;
                case 12:
                    posX += 26*26*26 * alpha[inputTree[i][j]].num;
                    break;
                case 13:
                    posY = alpha[inputTree[i][j]].num;
                    break;
                case 14:
                    posY += 26 * alpha[inputTree[i][j]].num;
                    break;
                case 15:
                    posY += 26*26 * alpha[inputTree[i][j]].num;
                    break;
                case 16:
                    posY += 26*26*26 * alpha[inputTree[i][j]].num;
                    break;
            }
            if (alpha[inputTree[i][j]].isCapital && j>0) {
                if (trueJ<5) {
                    jCorrection = 4-trueJ;
                } else if (trueJ<8) {
                    jCorrection += 8-trueJ;
                } else if (trueJ<12) {
                    jCorrection += 12-trueJ;
                }
            }
        }

        p.line(alpha[inputTree[i][0]].path1+posX,
                alpha[inputTree[i][0]].path2+posY,
                alpha[inputTree[i][0]].path3*10*scaleX+posX,
                alpha[inputTree[i][0]].path4*10*scaleY+posY);
    }
}
*/
