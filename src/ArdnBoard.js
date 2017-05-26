const IR = require('./IR');
const five = require('johnny-five');
const Led = require('./Led');
const config = require('../config');
const shouldLogIRs = config.logger.ir.logging;
const irLogInterval = config.logger.ir.irLogInterval;

module.exports = class IrBoard {
    constructor(port, quantizer) {
        this.id = port.id;
        this.quantizer = quantizer;
        this.portURL = port.portURL;
        this.irs = [];
        for (let i = port.irIndex.from; i <= port.irIndex.to; i++) {
            const ir = new IR(port, i);
            this.irs.push(ir);
        }
        console.log(`Initialize ${this.id}`);
    }

    readIR(board, i) {
        const ir = this.irs[i];
        const _this = this;
        board.analogRead(i, function(input) {
            if (input > ir.max) {
                ir.max = input;
            }
            if (input < ir.min) {
                ir.min = input;
            }
            const avgVal = ir.calcAvg(input);
            const scaledAvg = floatFormat(scale(avgVal, ir.max, ir.min, 1, 0), 3).toFixed(3);
            const scaledInput = floatFormat(scale(input, ir.max, ir.min, 1, 0), 3).toFixed(3);
            const diff = floatFormat(scaledInput - scaledAvg, 3).toFixed(3);
            const address = "/" + String(ir.port.id) + "/" + String(ir.index);
            if (ir.index != 100) {
                // ir.update();
                ir.counter++;
                const detected = ir.detect(scaledInput, scaledAvg);
                if (detected) {
                    if (!ir.isHit) {
                        ir.ease();
                        if (ir.counter % irLogInterval === 0) {
                            if (shouldLogIRs) {
                                console.log(`${red} BufferSize: ${ir.buffer.length} ${cyan} DIFF: ${diff} ${reset} INPUT ${scaledInput} AVG: ${scaledAvg} ${cyan} OSC-Address: ${address} ${reset}`);
                            }
                        }
                        _this.quantizer.addNoteQue(ir.index);
                    } else {
                        if (ir.counter % irLogInterval === 0) {
                            if (shouldLogIRs) {
                                console.log(`${reset} BufferSize: ${ir.buffer.length} ${cyan} DIFF: ${diff} ${reset} INPUT: ${scaledInput} AVG: ${scaledAvg} ${cyan} OSC-Address: ${address} ${reset}`);
                            }
                        }
                    }
                } else {
                    if (ir.counter % irLogInterval === 0) {
                        if (shouldLogIRs) {
                            console.log(`${reset} BufferSize: ${ir.buffer.length} ${cyan} DIFF: ${diff} ${reset} INPUT: ${scaledInput} AVG: ${scaledAvg} ${cyan} OSC-Address: ${address} ${reset}`);
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

const red = '\u001b[31m';
const reset = '\u001b[0m';
const green = '\u001b[32m';
const yellow = '\u001b[33m';
const blue = '\u001b[34m';
const magenta = '\u001b[35m';
const cyan = '\u001b[36m';
