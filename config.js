module.exports = {
    oscClient: {
        ipAddress: '192.168.179.4',
        port: 1192
    },
    logger:{
      ir:{
        logging: true,
        irLogInterval: 600
      },
      led: {
        logging: true
      }
    },
    arduinoPorts: [
        {
            id: "Arduino-A",
            portURL: "/dev/cu.usbmodem1451",
            irIndex: {
                from: 1,
                to: 3
            },
            ledInfo: [
                {
                    id: 1,
                    outputPin: 3,
                    interval: 800,
                    blinkTime: 30
                },
                {
                    id: 2,
                    outputPin: 5,
                    interval: 800,
                    blinkTime: 30
                },
                {
                    id: 3,
                    outputPin: 6,
                    interval: 800,
                    blinkTime: 30
                }
            ]
        },
        {
            id: "Arduino-B",
            portURL: "/dev/cu.usbmodem1411",
            irIndex: {
                from: 4,
                to: 6
            },
            ledInfo: [
                {
                    id: 4,
                    outputPin: 3,
                    interval: 800,
                    blinkTime: 30
                },
                {
                    id: 5,
                    outputPin: 5,
                    interval: 800,
                    blinkTime: 30
                },
                {
                    id: 6,
                    outputPin: 6,
                    interval: 800,
                    blinkTime: 30
                }
            ]
        }
    ],
    irParams: {
        1: {
            bufferSize: 100,
            thresh: 0.2,
            easingTime: 800
        },
        2: {
            bufferSize: 100,
            thresh: 0.2,
            easingTime: 800
        },
        3: {
            bufferSize: 60,
            thresh: 0.2,
            easingTime: 800
        },
        4: {
            bufferSize: 100,
            thresh: 0.2,
            easingTime: 800
        },
        5: {
            bufferSize: 150,
            thresh: 0.2,
            easingTime: 900
        },
        6: {
            bufferSize: 100,
            thresh: 0.2,
            easingTime: 800
        }
    }
}
