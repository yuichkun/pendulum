var osc = require('node-osc');

//送信先IPアドレス
var oscClient = new osc.Client("localhost", 1192);

//受信元IPアドレス
var oscServer = new osc.Server(3333, 'localhost');
var noteQues = [];


var five = require('johnny-five');
var board = new five.Board({ port: "/dev/tty.usbmodem1411" });

board.on("ready", function(){
  console.log("lsdkfjlsdkfjklsas");
  this.pinMode(13, five.Pin.OUTPUT);
  this.digitalWrite(13,0);

  // var led = new five.Led(13);
  var _this = this;
  oscServer.on("message", function(msg, rinfo) {
    console.log("msg ", msg);
      _this.digitalWrite(13,1);
      setTimeout(()=>{
        _this.digitalWrite(13,0);
      },50);
      noteQues.push(msg[1]);
  });
  // led.blink(10);
});



class Quantizer {
    constructor() {
        this.active = false;
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
        // console.log(path, index);
        oscClient.send(path, index);
    }
    update() {
        this.isOnBeat();
        // console.log(this.count);
        this.counter();
        this.checkQues();
    }
    checkQues() {
      if(this.count % (this.grid/16) == 0){
        if (noteQues.length >= 1) {
            for (var i = 0; i < noteQues.length; i++) {
                this.send("/note", noteQues[i]);
            }
            noteQues = [];
        };
      }
    }
    isOnBeat(){
      if(this.count % (this.grid/4) == 0){
        this.send("/beat/4", this.count/(this.grid/4));
      }
      if(this.count % (this.grid/8) == 0){
        this.send("/beat/8", this.count/(this.grid/8));
      }
      if(this.count % (this.grid/16) == 0){
        this.send("/beat/16", this.count/(this.grid/16));
      }
      if(this.count % (this.grid/32) == 0){
        this.send("/beat/32", this.count/(this.grid/32));
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

let quantizer = new Quantizer();
//グリッド（1小節の分割数）
quantizer.grid = 32;
//BPM
quantizer.bpm = 120;
//メトロノーム
quantizer.click = true;
quantizer.active = true;
quantizer.start();



// var black   = '\u001b[30m';
// var red     = '\u001b[31m';
// var green   = '\u001b[32m';
// var yellow  = '\u001b[33m';
// var blue    = '\u001b[34m';
// var magenta = '\u001b[35m';
// var cyan    = '\u001b[36m';
// var white   = '\u001b[37m';
// var reset   = '\u001b[0m';
