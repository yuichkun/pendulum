module.exports = {
    oscClient: {
        ipAddress: '192.168.179.3',
        port: 1192
    },
    arduinoPorts: [{
            id: "Arduino-A",
            portURL: "/dev/cu.usbmodem1451",
            irIndex: {
                from: 1,
                to: 3
            },
            ledIndex: {
                1: {
                    id: 2,
                    interval: 100,
                    blinkTime: 30
                },
                2: {
                    id: 4,
                    interval: 100,
                    blinkTime: 30
                },
                3: {
                    id: 7,
                    interval: 100,
                    blinkTime: 30
                }
            }
        }
        ,
        { id: "Arduino-B",
          portURL: "/dev/cu.usbmodem1411",
          irIndex: {
            from: 4,
            to: 6
          },
          ledIndex: {
            4:{
              id:2,
              interval: 100,
              blinkTime: 30
            },
            5:{
              id: 4,
              interval: 100,
              blinkTime: 30
            },
            6:{
              id: 7,
              interval: 100,
              blinkTime: 30
            }
          }
        }
    ],
    irParams: {
        1: {
            bufferSize: 40,
            thresh: 0.2,
            easingTime: 1000
            // bufferSize: 40,
            // thresh: 0.21,
            // easingTime: 100
        },
        2: {
            bufferSize: 100,
            thresh: 0.2,
            easingTime: 1000
        },
        3: {
            bufferSize: 60,
            thresh: 0.2,
            easingTime: 1000
        },
        4: {
            bufferSize: 100,
            thresh: 0.2,
            easingTime: 800
        },
        5: {
            bufferSize: 150,
            thresh: 0.2,
            easingTime: 1000
        },
        6: {
            bufferSize: 100,
            thresh: 0.2,
            easingTime: 1000
        }
        // ,
        // 7: {
        //     bufferSize: 100,
        //     thresh: 0.15,
        //     easingTime: 1000
        // },
        // 8: {
        //     bufferSize: 100,
        //     thresh: 0.2,
        //     easingTime: 900
        // }
    }
}
