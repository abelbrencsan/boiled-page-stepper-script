# Boiled Page stepper script

A simple and lightweight stepper JavaScript module for Boiled Page frontend framework that can be used to increment or decrement input values.

## Install

Place `stepper.js` to `/assets/js` directory and add its path to `scripts` variable in `gulpfile.js` to be combined with other scripts.

## Usage

To create a new stepper instance, call `Stepper` constructor the following way:

```js
// Create new stepper instance
var stepper = new Stepper(options);

// Initialize stepper instance
stepper.init();
```

## Options

Available options for stepper constructor:

Option| Type | Default | Required | Description
------|------|---------|----------|------------
`input` | Object | null | Yes | Input element that's value is incremented or decremented on a stepper trigger click. 
`triggers` | Array | [] | Yes | Array of stepper triggers. `element` and `value` properties must be defined for each trigger.
`initCallback` | Function | null | No | Callback function after stepper is initialized.
`stepCallback` | Function | null | No | Callback function after input value is stepped.
`setValueCallback` | Function | null | No | Callback function after input value is set.
`destroyCallback` | Function | null | No | Callback function after stepper is destroyed.

Available options for a stepper trigger object:

Option| Type | Default | Required | Description
------|------|---------|----------|------------
`element` | Object | null | Yes | Element that increments or decrements input value on click.
`value` | Number | null | Yes | Input value is incremented or decremented by given value multiplied by input's `step` attribute.

## Methods

### Initialize stepper

`init()` - Initialize stepper. It gets minimum, maximum and step attributes of input, creates events relevant to stepper.

### Step input by given value

`stepByValue(value)` - Increment or decrement input by given value.

Parameter | Type | Required | Description
----------|------|----------|------------
`value` | Number | Yes | Value to be stepped by input.

### Set input value

`setValue(value)` - Set input to given value.

Parameter | Type | Required | Description
----------|------|----------|------------
`value` | Mixed | Yes | Set input to given value.

### Destroy stepper

`destroy()` - Destroy stepper. It removes events relevant to stepper.

## Examples

### Example 1

Te following example shows an input element with two button. The first one increments, the second one decrements input value by one. You will also need to add form and button components to make the following example works properly.

-   Form component: <https://www.github.com/abelbrencsan/boiled-page-form-component>
-   Button component: <https://www.github.com/abelbrencsan/boiled-page-button-component>

```html
<div class="grid grid--gutter grid--gutter--half">
  <div class="grid-col">
    <button id="quantitySub" class="button" type="button">-1</button>
  </div>
  <div class="grid-col grid-col--fit">
    <div class="form-item">
      <label class="form-label is-visually-hidden" for="quantity">Quantity</label>
      <input id="quantity" name="quantity" class="form-input form-input--stepper" type="number" />
    </div>
  </div>
  <div class="grid-col">
    <button id="quantityAdd" class="button" type="button">+1</button>
  </div>
</div>
```

Place the following code inside `assets/js/app.js` to initialize validator for form elements.

```js
// Initialize stepper
var quantityStepper = new Stepper({
  input: document.getElementById('quantity'),
  triggers: [
    {
      element: document.getElementById('quantitySub'),
      value: -1
    },
    {
      element: document.getElementById('quantityAdd'),
      value: 1
    }
  ]
});
quantityStepper.init();
```

Add the following form input component extension to hide steppers rendered by browser.

```scss
/* Form input component extensions */
input.form-input {

  // Stepper form input
  &.form-input--stepper {
    -moz-appearance: textfield;

    &::-webkit-outer-spin-button,
    &::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }
  }
}
```
