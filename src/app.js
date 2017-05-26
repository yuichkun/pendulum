//Dependencies
const _ = require('lodash');
const five = require('johnny-five');

//Libs
const Led = require('./Led');
const Quantizer = require('./Quantizer');
const ArdnBoard = require('./ArdnBoard');

//Config & Aliases
const config = require('../config');
const arduinos = config.arduinoPorts;
const fiveBoards = new five.Boards(arduinos);
let ArdnBoards = [];

let quantizer = new Quantizer();
quantizer.grid = 16;
quantizer.bpm = 100;
quantizer.click = true;
quantizer.active = true;

//Main
fiveBoards.on("ready", function(){
	console.log("–––––––––––––––START–––––––––––––––");
	quantizer.start();
	initArdnBoards();
 	startArdnBoards(this);
});

function initArdnBoards(){
	for(let i = 0; i < arduinos.length; i++){
		const port = arduinos[i];
		ArdnBoards.push(new ArdnBoard(port, quantizer));
	}
}

function startArdnBoards(_this){
	for(let i = 0; i < ArdnBoards.length; i++){
		const ArdnBoard = ArdnBoards[i];
		const board = _this[i];
		board.leds = instantiateLeds(board);
		quantizer.boards.push(board);
		for(let ir = 0; ir < ArdnBoard.irs.length; ir++){
			ArdnBoard.readIR(board, ir);
		}
	}
}

function instantiateLeds(board){
	const leds = [];
	for(let i = 0; i < board.ledInfo.length; i++){
		leds.push(new Led(board.ledInfo[i]));
	}
	return leds;
}
