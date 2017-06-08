Simple project using node.js designed to run on a Raspberry Pi to test 
GPIO access. The program doesn't seem to need to run as root as long as 
the running user is in the `rpio` group.

The follow pins are defined and used:
* Relay, active low (digital out, in1: pin7, gpio 4, in2: pin9, gpio 17, in3: pin11, gpio 27, in4: pin 13, gpio 22)
* Led, active high (digital out, pin 16, gpio 23)
* Button,  pulled high, active low (digital in, pin 40, gpio 21)
* Button, pulled low, active high (digital in, pin 38, gpio 20)
* Motion sensor (digital in, pin 37, gpio 26)

Pins not used yet as I'm missing a MCP4008 ADC.
