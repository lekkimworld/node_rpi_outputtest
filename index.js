'use strict';
const Cleanup = require('./cleanup');
const gpio = require('rpi-gpio');

// use raspberry pi pin numbering
gpio.setMode(gpio.MODE_RPI);

// define pins
const pinButtonActiveHigh = 40;
const pinButtonActiveLow = 38;
const pinLed = 16;
const pinMotion = 37;
const pinRelay1 = 7;
const pinRelay2 = 11;
const pinRelay3 = 13;
const pinRelay4 = 15;
const pinRelays = [pinRelay1, pinRelay2, pinRelay3, pinRelay4];

// utility function to blink led x times at y delay - used from 
// buttons
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

// setup led and relay pins as outputs
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

// listen for changes on inputs and define inputs
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

// toggle relay on and off every 2 seconds
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
