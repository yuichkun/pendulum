//Dependencies
const _ = require('lodash');
const osc = require('node-osc');
//Libs
const Diminuator = require('./Diminuator');
const Blinker = require('./Blinker');
//Config
const config = require('../config');
const oscClient = new osc.Client(config.oscClient.ipAddress, config.oscClient.port);
let startTime;
let endTime;
const ledGlobalState = false;

module.exports = class Quantizer {
    constructor() {
        this.active = false;
        this.noteQues = [];
        this.boards = [];
    }
    start() {
        this.reset();
        let thread = () => {
            startTime = Date.now();
            setTimeout(
                callback, this.nextInterval
            );
        };
        const callback = () => {
            this.update();
            endTime = Date.now();
            if (this.active) {
              endTime = Date.now();
              let diff =  endTime - startTime;
              let delay = this.interval - diff;
              // console.log("delay", delay);
              this.nextInterval = this.interval + delay;
                thread();
            }
        };
        thread();
    }
    addNoteQue(id){
      this.noteQues.push(id);
    }
    set bpm(bpm) {
        let interval = (60 / bpm) * 4 * 1000 / this.grid;
        console.log("Setting the interval time to ", interval);
        this.interval = interval;
        this.nextInterval = this.interval;
    }
    set click(bool) {
        console.log("\u001b[36mMetronome is: ON\u001b[0m");
        this._click = bool;
    }
    update() {
        this.isOnBeat();
        this.counter();
        this.checkQues();
    }
    checkQues() {
      if(ledGlobalState){
        _.map(this.boards, (board)=>{
          _.map(board.leds, (led)=>{
              // led.run(board, new Diminuator(0.3));
              led.run(board, new Blinker());
          })
        })
      } else {
        if (this.count % (this.grid / 16) == 0) {
            let combo = this.noteQues.length;
            if (combo >= 1) {
                // console.log("note ques are ", this.noteQues);
                for (var i = 0; i < this.noteQues.length; i++) {
                    const note = this.noteQues[i];
                    oscClient.send("/note", note, combo);
                    _.map(this.boards, (board)=>{
                      _.map(board.leds, (led)=>{
                        if(note === led.id){
                          led.combo = combo;
                          let supplier;
                          if (led.combo < 3) {
                              supplier = new Diminuator(1);
                          } else {
                              supplier = new Blinker();
                          }
                          led.run(board, supplier);
                        }
                      })
                    })
                }
                this.noteQues = [];
            };
        }
      }

    }
    isOnBeat() {
        if (this.count % (this.grid / 4) == 0) {
            oscClient.send("/beat/4", this.count / (this.grid / 4));
        }
        if (this.count % (this.grid / 8) == 0) {
            oscClient.send("/beat/8", this.count / (this.grid / 8));
        }
        if (this.count % (this.grid / 16) == 0) {
            oscClient.send("/beat/16", this.count / (this.grid / 16));
        }
        // if (this.count % (this.grid / 32) == 0) {
        //     oscClient.send("/beat/32", this.count / (this.grid / 32));
        // }
    }
    stop() {
        this.active = false;
    }
    counter() {
        this.count++;
        if (this.count > this.grid) {
            this.reset();
        }
    }
    reset() {
        this.active = true;
        this.count = 1;
    }
};

//Console Color
var black = '\u001b[30m';
var red = '\u001b[31m';
var green = '\u001b[32m';
var yellow = '\u001b[33m';
var blue = '\u001b[34m';
var magenta = '\u001b[35m';
var cyan = '\u001b[36m';
var white = '\u001b[37m';
var reset = '\u001b[0m';
