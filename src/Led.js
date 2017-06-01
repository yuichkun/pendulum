//Dependencies
const five = require('johnny-five');
const osc = require('node-osc');

//Config
let ledStates = [true, true, true, true, true, true];
const config = require('../config');
const shouldLogLeds = config.logger.led.logging;
const ledOscServer = new osc.Server(2222, 'localhost');
ledOscServer.on('message', (msg) => {
  console.log("message received ", msg);
  ledStates[msg[1]-1] = msg[2];
});

module.exports = class Led {
    constructor(ledInfo) {
        this.id = ledInfo.id;
        this.outputPin = ledInfo.outputPin;
        this.interval = ledInfo.interval;
        this.combo = 1;
        this.active = false;
    }
    log(){
      if(shouldLogLeds){
        if(this.id === 1){
          console.log(ledStates);
        }
      }
    }
    run(board, supplier) {
        this.log();
        if (ledStates[this.id - 1]) {
            if (!this.active) {
                const outputPin = this.outputPin;
                board.pinMode(outputPin, five.Pin.PWM);
                const loop = setInterval(() => {
                    supplier.update();
                    this.active = supplier.isAlive();
                    if (this.active) {
                        let power = supplier.getPower();
                        power = power * (this.combo * 0.6);
                        board.analogWrite(outputPin, power);
                    } else {
                        board.analogWrite(outputPin, 0);
                        clearInterval(loop);
                    }
                }, 1);
            }
        }
    }
    exhibit(board){
      const outputPin = this.outputPin;
      board.pinMode(outputPin, five.Pin.PWM);
      board.analogWrite(outputPin, 255);
    }
}
