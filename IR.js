var config = require('./config');
var irParams = config.irParams;

class IR {
  constructor(port, index){
    this.port = port;
    this.index = index;
    this.counter = 0;
    this.isHit = false;
    this.buffer = [];
    this.bufferSize = irParams[this.index].bufferSize;
    this.thresh = irParams[this.index].thresh;
    this.easingTime = irParams[this.index].easingTime;
    this.max = 0;
    this.min = 10000;
    this.bufferMax = 0;
    this.bufferMin = 10000;
  }

  update(){
    this.counter++;
    if(this.counter > 100){
      this.counter = 0;
    }
  }

  detect(scaledInput, scaledAvg){
    return (scaledInput - scaledAvg) > this.thresh;
  }

  ease(){
    this.isHit = true;
    setTimeout(() => {
      this.isHit = false;
    }, this.easingTime);
  }


  calcAvg(input){
    if(this.buffer.length >= this.bufferSize){
			this.buffer.shift();
		}
		this.buffer.push(input);
		var sum = 0.0;
		this.bufferMax = 0.0;
		this.bufferMin = 10000.0;
		for(var i = 0; i < this.buffer.length; i++){
      var thisbuffer = this.buffer[i];
			if(thisbuffer > this.bufferMax){
				this.bufferMax = thisbuffer;
			}
			if(thisbuffer < this.bufferMin){
				this.bufferMin = thisbuffer;
			}
      sum += thisbuffer;
		}
		var avg = sum / this.buffer.length;
		return avg;
  }
}

module.exports = IR;
