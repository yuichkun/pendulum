var five = require("johnny-five");
var pixel = require("./pixel");

var opts = {};
opts.port = process.argv[2] || "";

var board = new five.Board(opts);

var fps = 20; // how many frames per second do you want to try?

board.on("ready", function() {

    console.log("Board ready, lets add light");

    let strip = new pixel.Strip({
        board: this,
        controller: "FIRMATA",
        data: 6,
        length: 150
    });

    strip.on("ready", function() {
        strip.clear();
        console.log("Strip ready, let's go");
        console.log(this);
        console.log(strip);
        console.log(strip.length);
        // strip.color([20,13,13]);
        // strip.show();
        // strip.clear();
        strip.color([50,100,100]);
        strip.show();
        //
        // var colors = ["red", "green", "blue", "yellow", "cyan", "magenta", "white"];
        // var current_colors = 0;
        // var blinker = setInterval(function() {
        //
        //     if (++current_colors >= colors.length) current_colors = 0;
        //     strip.color(colors[current_colors]); // blanks it out
        //     strip.show();
        // }, 1000/fps);
    });
});
