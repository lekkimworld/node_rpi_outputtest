'use strict';

/*
- Relay, active low
Pins should be digital out
in1, pin7, gpio 4
in2, pin9, gpio 17
in3, pin11, gpio 27
in4, pin 13, gpio 22

- Led, active high (digital out)
pin 16, gpio 23

- Button,  pulled high, active low (digital in)
pin 40, gpio 21

- Button, pulled low, active high (digital in)
pin 38, gpio 20

- Potentiometer (analog in)
pin 12, gpio 18

- Motion sensor (digital in)
pin 37, gpio 26 
*/

const Cleanup = require('./cleanup');
const gpio = require('rpi-gpio');

gpio.setMode(gpio.MODE_RPI);

const pinButtonActiveHigh = 40;
const pinButtonActiveLow = 38;
const pinLed = 16;
const pinMotion = 37;
const pinRelay1 = 7;
const pinRelay2 = 11;
const pinRelay3 = 13;
const pinRelay4 = 15;
const pinRelays = [pinRelay1, pinRelay2, pinRelay3, pinRelay4];

const blinkLed = (times, delay) => {
    let counter = 0;
    const blink = () => {
        counter++;
        gpio.write(pinLed, true, (err) => {
            if (err) {
                console.log('Error blinking led..');
            } else {
                global.setTimeout(() => {
                    gpio.write(pinLed, false);
                    if (counter < times) global.setTimeout(blink, delay);
                }, delay);
            }
        });
    }
    blink();
}

gpio.setup(pinLed,  gpio.DIR_OUT, () => {
    console.log('Initialized led...');
    gpio.write(pinLed, false, (err) => {
        console.log('Initialized led to off...');
    })
});
pinRelays.forEach(pin => {
        gpio.setup(pin, gpio.DIR_OUT, () => {
                gpio.write(pin, true);
        });
});

gpio.on('change', function(channel, value) {
    if (channel === pinButtonActiveLow) {
        console.log("button active low pressed");
        blinkLed(2, 200);
    } else if (channel === pinButtonActiveHigh) {
        console.log("button active high pressed");
        blinkLed(1, 200);
    } else if (channel === pinMotion) {
        console.log("motion...");
        blinkLed(5, 100);
    }
});
gpio.setup(pinButtonActiveHigh, gpio.DIR_IN, gpio.EDGE_RISING);
gpio.setup(pinButtonActiveLow, gpio.DIR_IN, gpio.EDGE_FALLING);
gpio.setup(pinMotion, gpio.DIR_IN, gpio.EDGE_FALLING);


let state = true;
const toggle = () => {
    state = !state;
    pinRelays.forEach(pin => {
        gpio.write(pin, state);
    });
    delayed();
}
const delayed = () => {
    global.setTimeout(toggle, 2000);
}
delayed();


// setup termination listener
Cleanup(() => {
    gpio.destroy();
});
