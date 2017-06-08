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

const pinButtonActiveHigh = 21;
const pinButtonActiveLow = 20;
const pinLed = 23;
const pinMotion = 26;

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
}

gpio.setup(pinButtonActiveHigh, gpio.DIR_IN, () => {
    gpio.read(pinButtonActiveHigh, function(err, value) {
        console.log('Button, active HIGH value is: ' + value);
    });
});
gpio.setup(pinButtonActiveLow, gpio.DIR_IN, () => {
    gpio.read(pinButtonActiveLow, function(err, value) {
        console.log('Button, active LOW value is: ' + value);
    });
});
gpio.setup(pinLed,  gpio.DIR_OUT, () => {
    gpio.write(pinLed, false, (err) => {
        console.log('Initialized led to off...');
    })
});

gpio.on('change', function(channel, value) {
    console.log('Channel ' + channel + ' value is now ' + value);
    if (channel === pinButtonActiveLow) {
        blinkLed(2, 200);
    } else if (channel === pinButtonActiveHigh) {
        blinkLed(1, 200);
    }
});
gpio.setup(pinButtonActiveHigh, gpio.DIR_IN, gpio.EDGE_BOTH);
gpio.setup(pinButtonActiveLow, gpio.DIR_IN, gpio.EDGE_BOTH);

// setup termination listener
Cleanup((gpio) => {
    gpio.destroy();
});
