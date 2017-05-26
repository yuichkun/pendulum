module.exports = class Diminuator {
    constructor(velocity) {
        this.power = 255;
        this.velocity = velocity;
    }
    update() {
        this.power -= this.velocity;
    }
    isAlive() {
        return this.power >= 0;
    }
    getPower() {
        return this.power;
    }
};
