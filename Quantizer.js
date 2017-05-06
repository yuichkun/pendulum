var osc = require('node-osc');
var config = require('./config');
//送信先IPアドレス
var oscClient = new osc.Client(config.oscClient.ipAddress, config.oscClient.port);

class Quantizer {
    constructor() {
        this.active = false;
        this.noteQues = [];
    }
    start() {
        this.reset();
        let thread = () => {
            setTimeout(
                callback, this.interval
            );
        };
        let callback = () => {
            this.update();
            if (this.active) {
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
    }
    set click(bool) {
        console.log("\u001b[36mMetronome is: ON\u001b[0m");
        this._click = bool;
    }
    send(path, index) {
        // if(path === '/note'){
          oscClient.send(path, index);
        // }
    }
    update() {
        this.isOnBeat();
        // console.log(this.count);
        this.counter();
        this.checkQues();
    }
    checkQues() {
        if (this.count % (this.grid / 16) == 0) {
            if (this.noteQues.length >= 1) {
                for (var i = 0; i < this.noteQues.length; i++) {
                    this.send("/note", this.noteQues[i]);
                }
                this.noteQues = [];
            };
        }
    }
    isOnBeat() {
        if (this.count % (this.grid / 4) == 0) {
            this.send("/beat/4", this.count / (this.grid / 4));
        }
        if (this.count % (this.grid / 8) == 0) {
            this.send("/beat/8", this.count / (this.grid / 8));
        }
        if (this.count % (this.grid / 16) == 0) {
            this.send("/beat/16", this.count / (this.grid / 16));
        }
        if (this.count % (this.grid / 32) == 0) {
            this.send("/beat/32", this.count / (this.grid / 32));
        }
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
module.exports = Quantizer;

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
