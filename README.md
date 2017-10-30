![Veasy.js](https://github.com/Albert-Gao/veasy/raw/master/docs/_media/logo.png)

# Veasy.js

[![npm version](https://badge.fury.io/js/veasy.svg)](https://badge.fury.io/js/veasy)
[![npm](https://img.shields.io/npm/l/express.svg)](https://www.npmjs.com/package/veasy)
[![Build Status](https://travis-ci.org/Albert-Gao/veasy.svg?branch=master)](https://travis-ci.org/Albert-Gao/veasy)
[![Coverage Status](https://coveralls.io/repos/github/Albert-Gao/veasy/badge.svg)](https://coveralls.io/github/Albert-Gao/veasy)

A comprehensive react form solution which aims to eliminate all tedious logic.

**[Documentation](https://albert-gao.github.io/veasy/)**

## Features

- Field validation (We handle the validation logic!)
- Form status (check whether all fields ready or not)
- Generate initial state with default value
- Get fields value for submitting
- Auto update fields `props` according to validation result
- Auto binding fields `props`
- onBlur: trigger validation automatically
- onChange: trigger validation automatically
- onReset: reset form to default state
- Need more features? Raise an [issue](https://github.com/Albert-Gao/veasy) :)

## Why use

- Declarative way to define your validation rule
- Comprehensive validation rule set and easy to extend
- Progressive validation mechanism.
- Highly customizable: error message, default state, whatever you want.
- Clean JSX hierarchy, use your own field item component.
- Promise based architecture.
- Handle all the tedious logic without learning too much.

## Install

```bash
npm install --save veasy
```

## A quick 2 steps how to

Suppose you have a form field component:

```xml
<FieldItem name="title" />
```

### Step 1: You can write a schema using json

```javascript
import VeasyForm, {createInitialState} from 'veasy';

// `title` here should match the name of the field
const formSchema = {
  title: {
    minLength: 10,
    maxLength: 20,
    exclude: 'bad words'
  }
};

// Then setup the initial state in the component's constructor
// Find out add your own state in the doc
this.state = createInitialState(formSchema);
```

### Step 2: Auto bind the props

Then wrap using our `<VeasyForm>` component:

```xml
<VeasyForm
  schema={formSchema}
  allState={this.state}
  update={(fieldState) => {this.setState(fieldState);}}
>
  <FieldItem name="title" />
</VeasyForm>
```

Congrats! Now you automatically get the following features:

1. Your `FieldItem` will get the following `props` at runtime:
    - `status`: For changing the look, ('normal', 'ok' and 'error')
    - `errorText`: For showing the error message.
    - `value`: Like how you bind the value for every `controlled component` :)
    - `onChange`: A change handler for handling the validation when user changing the value.
1. Anytime the user changes something, the above 3 `props` will auto updated by `Veasy`
1. `OnChange` and `onBlur` will auto trigger the validation as well.
1. `isFormOK` will be true when all fields's status equals to `ok`.
1. `onReset` has been handled for resetting the state to initial state, you just need to add a plain form reset button ( < button type='reset' > ).

There is even a `getFieldsValue()` method for you to get all the fields value, even you don't include all the fields in the schema, [we cover that case for you](https://albert-gao.github.io/veasy/#/collect-values) :)

Check the working code example at [here](https://github.com/Albert-Gao/veasy/tree/master/example).

> Tip: There is an extra `isFormOK` prop at the root level of `state` to indicate the status of the form according to all the fields defined in the schema.

Now you get it! Let's take several minutes to go through our **[documentation](https://albert-gao.github.io/veasy/)**.

## Chaining rules and Progressive validation mechanism

- Rules in schema are processed one-by-one.
- Unless the value passes the first rule, `Veasy` won't bother checking the next.

Many forms in the wild display all errors at once, which can be many! That's scary!

Instead, we guide the user through the form **by validating each rule one-by-one**. As a very simple example, consider this field which expects an int, min and max.

Your schema is like this:

```javascript
{
  age: {
    isInt: true,
    min: [16, 'should be older than 16'],
    max: 99
  }
}
```

If the user enters `one`, `veasy` will stop at first rule and let the user know that it should be a number. If they then enter `1`, `veasy` will inform them that they `should be older than 16`, and so on until all rules are valid.

This example is simple, you can chain all the rules to build your own. And thanks to `React`, it all happens immediately. All you need to do is to declare a schema.
