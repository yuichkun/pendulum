var IR = require('./IR');
var config = require('./config');
var five = require('johnny-five');
class IrBoard {
    constructor(port, quantizer) {
        this.id = port.id;
        this.quantizer = quantizer;
        this.portURL = port.portURL;
        this.irs = [];
        this.leds = port.ledIndex;
        for (var i = port.irIndex.from; i <= port.irIndex.to; i++) {
            var ir = new IR(port, i);
            this.irs.push(ir);
        }
        console.log(`Initialize ${this.id}`);
        // //IR info
        console.log(this);
    }

    readIR(board, i) {
        var ir = this.irs[i];
        let _this = this;
        board.analogRead(i, function(input) {
            if (input > ir.max) {
                ir.max = input;
            }
            if (input < ir.min) {
                ir.min = input;
            }
            var avgVal = ir.calcAvg(input);
            var scaledAvg = scale(avgVal, ir.max, ir.min, 1, 0);
            var scaledInput = scale(input, ir.max, ir.min, 1, 0);
            scaledAvg = floatFormat(scaledAvg, 3).toFixed(3);
            scaledInput = floatFormat(scaledInput, 3).toFixed(3);
            var address = "/" + String(ir.port.id) + "/" + String(ir.index);
            if (ir.index != 400) {
                ir.update();
                var detected = ir.detect(scaledInput, scaledAvg);
                // if (ir.counter % 10 == 0) {
                if (true) {
                    if (detected) {
                        if (!ir.isHit) {
                            ir.ease();
                            console.log(`${red} BufferSize: ${ir.buffer.length} INPUT ${scaledInput} AVG: ${scaledAvg} INDEX: ${ir.index} Board: ${_this.id}`);
                            _this.quantizer.addNoteQue(ir.index);

                            let ledInfo = _this.leds[ir.index];
                            board.pinMode(ledInfo.id, five.Pin.OUTPUT);
                            board.digitalWrite(ledInfo.id, 1);
                            setTimeout(() => {
                                board.digitalWrite(ledInfo.id, 0);
                            }, ledInfo.interval);

                        } else {
                            console.log(`${reset} BufferSize: ${ir.buffer.length} INPUT: ${scaledInput} AVG: ${scaledAvg} OSC-Address: ${address}`);
                        }
                    } else {
                        if (ir.counter % 5 == 0) {
                            console.log(`${reset} BufferSize: ${ir.buffer.length} INPUT: ${input} AVG: ${scaledAvg} OSC-Address: ${address}`);
                        }
                    }
                }
            }
        });
    };
}

//////////////////////////////////////////////////////
function scale(value, low1, high1, low2, high2) {
    return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
}

function floatFormat(number, n) {
    var _pow = Math.pow(10, n);
    return Math.round(number * _pow) / _pow;
}
var red = '\u001b[31m';
var reset = '\u001b[0m';

module.exports = IrBoard;
