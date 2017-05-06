var config = require('./config');
var ArdnBoard = require('./ArdnBoard');
var five = require('johnny-five');

//Arduino
var arduinos = config.arduinoPorts;
var fiveBoards = new five.Boards(arduinos);
var ArdnBoards = [];

var Quantizer = require('./Quantizer');
let quantizer = new Quantizer();
//グリッド（1小節の分割数）
quantizer.grid = 32;
//BPM
quantizer.bpm = 100;
//メトロノーム
quantizer.click = true;
quantizer.active = true;
quantizer.start();
//Main

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
// function startArdnBoards(){
// 	for(var i = 0; i < ArdnBoards.length; i++){
// 		var ArdnBoard = ArdnBoards[i];
// 		ArdnBoard.readIRs(fiveBoards[0]);
// 	}
// };

function startArdnBoards(_this){
	for(var i = 0; i < ArdnBoards.length; i++){
		var ArdnBoard = ArdnBoards[i];
		var board = _this[i];
		for(var ir = 0; ir < ArdnBoard.irs.length; ir++){
			ArdnBoard.readIR(board, ir);
		}
	}
};
