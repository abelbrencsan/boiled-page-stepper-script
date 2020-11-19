/**
 * Stepper - v1.0.1
 * Copyright 2020 Abel Brencsan
 * Released under the MIT License
 */

var Stepper = function(options) {

	'use strict';

	// Test required options
	if (typeof options.input !== 'object') throw 'Stepper "input" option must be an object';
	if (typeof options.triggers !== 'object') throw 'Stepper "triggers" option must be an object';
	if (typeof options.triggers == 'object') {
		for (var i = 0; i < options.triggers.length; i++) {
			if (typeof options.triggers[i].element !== 'object') throw 'Stepper trigger "element" option must be an object';
			if (typeof options.triggers[i].value !== 'number') throw 'Stepper trigger "value" option must be a number';
		}
	}

	// Default stepper instance options
	var defaults = {
		input: null,
		triggers: null,
		initCallback: null,
		stepCallback: null,
		setValueCallback: null,
		destroyCallback: null
	};

	// Extend stepper instance options with defaults
	for (var key in defaults) {
		this[key] = (options.hasOwnProperty(key)) ? options[key] : defaults[key];
	}

	// Stepper instance variables
	this.isInitialized = false;
	this.step = 1;
	this.min = null;
	this.max = null;
	this.power = 0;
	this.precision = 0;

};

Stepper.prototype = function () {

	'use strict';

	var stepper = {

		/**
		* Initialize stepper. It gets minimum, maximum and step attributes of input, creates events relevant to stepper. (public)
		*/
		init: function() {
			if (this.isInitialized) return;
			var step, min, max;
			this.handleEvent = function(event) {
				stepper.handleEvents.call(this, event);
			};
			if (this.input.hasAttribute('step')) {
				step = parseFloat(this.input.getAttribute('step'));
				if (!isNaN(step)) {
					this.step = step;
				}
			}
			if (this.input.hasAttribute('max')) {
				max = Number(this.input.getAttribute('max'));
				if (!isNaN(max)) {
					this.max = max;
				}
			}
			if (this.input.hasAttribute('min')) {
				min = Number(this.input.getAttribute('min'));
				if (!isNaN(max)) {
					this.min = min;
				}
			}
			this.precision = getNumberPrecision(this.step);
			if (this.precision) {
				this.power = this.precision * -1;
			}
			else {
				this.power = Math.floor(Math.log(this.step) / Math.LN10);
			}
			if (this.input.nodeName.toLowerCase() == 'input') {
				this.input.addEventListener('blur', this);
			}
			for (var i = 0; i < this.triggers.length; i++) {
				this.triggers[i].element.addEventListener('click', this);
			}
			this.isInitialized = true;
			if (this.initCallback) this.initCallback.call(this);
		},

		/**
		* Increment or decrement input by given value. (public)
		* @param value number
		*/
		stepByValue: function(value) {
			var remainder, roundedValue, precision;
			var inputValue = parseFloat(this.input.value);
			if (isNaN(inputValue)) {
				inputValue = 0;
			}
			if (this.precision) {
				precision = Math.abs(this.power);
			}
			else {
				precision = 1;
			}
			roundedValue = precisionRound(inputValue + value, precision);
			remainder = precisionRound(roundedValue % this.step, precision);
			if (value > 0) {
				if (remainder > 0 && remainder < this.step) {
					roundedValue -= remainder;
				}
				else if (remainder < 0 && remainder > this.step * -1) {
					roundedValue -= this.step + remainder;
				}
			}
			else if (value < 0) {
				if (remainder > 0 && remainder < this.step) {
					roundedValue += this.step - remainder;
				}
				else if (remainder < 0 && remainder > this.step * -1) {
					roundedValue -= remainder;
				}
			}
			stepper.setValue.call(this, roundedValue);
			if (this.stepCallback) this.stepCallback.call(this);
		},

		/**
		* Set input to given value. (public)
		* @param value mixed
		*/
		setValue: function(value) {
			if (value < this.min) {
				value = this.min;
			}
			else if(value > this.max) {
				value = this.max;
			}
			this.input.value = value;
			if (this.setValueCallback) this.setValueCallback.call(this, value);
		},

		/**
		* Handle events (private)
		* On trigger click: Step input value by trigger's value.
		* On input blur: Clear input vaue when it is not a number.
		* @param event object
		*/
		handleEvents: function(event) {
			var inputValue;
			switch(event.type) {
				case 'click':
					for (var i = 0; i < this.triggers.length; i++) {
						if (event.target == this.triggers[i].element) {
							event.preventDefault();
							stepper.stepByValue.call(this, parseFloat(this.triggers[i].value * this.step));
						}
					}
					break;
				case 'blur':
					if (event.target == this.input) {
						inputValue = parseFloat(this.input.value);
						if (isNaN(inputValue)) {
							inputValue = '';
						}
						stepper.setValue.call(this, inputValue);
					}
					break;
			}
		},

		/**
		* Destroy stepper. It removes events relevant to stepper. (public)
		*/
		destroy: function() {
			if (!this.isInitialized) return;
			this.power = 0;
			if (this.input.nodeName.toLowerCase() == 'input') {
				this.input.removeEventListener('blur', this);
			}
			for (var i = 0; i < this.triggers.length; i++) {
				this.triggers[i].element.removeEventListener('click', this);
			}
			this.isInitialized = false;
			if (this.destroyCallback) this.destroyCallback.call(this);
		},

		/**
		 * Get value of "isInitialized" to be abe to check stepper is initialized. (public)
		 */
		getIsInitialized: function() {
			return this.isInitialized;
		}
	};

	/**
	* Round number with given precision. (private)
	*/
	function precisionRound(value, precision) {
		var factor = Math.pow(10, precision);
		return Math.round(value * factor) / factor;
	}
	
	/**
	* Get precision of a given number. (private)
	*/
	function getNumberPrecision (number) {
		var exponentiation = 1;
		var precision = 0;
		while (Math.round(number * exponentiation) / exponentiation !== number) {
			exponentiation *= 10;
			precision++;
		}
		return precision;
	}

	return {
		init: stepper.init,
		stepByValue: stepper.stepByValue,
		setValue: stepper.setValue,
		destroy: stepper.destroy,
		getIsInitialized: stepper.getIsInitialized
	};

}();
