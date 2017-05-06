var config = require('./config');
var ArdnBoard = require('./ArdnBoard');
var five = require('johnny-five');

//Arduino
var arduinos = config.arduinoPorts;
var fiveBoards = new five.Boards(arduinos);
var ArdnBoards = [];

var Quantizer = require('./Quantizer');
let quantizer = new Quantizer();
quantizer.grid = 32;
quantizer.bpm = 100;
quantizer.click = true;
quantizer.active = true;
quantizer.start();

fiveBoards.on("ready", function(){
	console.log("–––––––––––––––START–––––––––––––––");
	initArdnBoards();
 	startArdnBoards(this);
});

//Functions
function initArdnBoards(){
	for(var i = 0; i < arduinos.length; i++){
		var port = arduinos[i];
		ArdnBoards.push(new ArdnBoard(port, quantizer));
	}
};

function startArdnBoards(_this){
	for(var i = 0; i < ArdnBoards.length; i++){
		var ArdnBoard = ArdnBoards[i];
		var board = _this[i];
		for(var ir = 0; ir < ArdnBoard.irs.length; ir++){
			ArdnBoard.readIR(board, ir);
		}
	}
};
