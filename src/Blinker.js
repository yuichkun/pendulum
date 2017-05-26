module.exports = class Blinker {
    constructor() {
        this.lifetime = 2000;
        this.velocity = 1;
    }
    update() {
        this.lifetime -= this.velocity;
    }
    isAlive() {
        return this.lifetime >= 0;
    }
    getPower() {
        if (this.lifetime % 50 >= 25) {
            return 255;
        }
        return 0;
    }
};
