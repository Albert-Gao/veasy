![Veasy.js](https://github.com/Albert-Gao/veasy/raw/master/docs/_media/logo.png)

# Veasy.js

[![Build Status](https://travis-ci.org/Albert-Gao/veasy.svg?branch=master)](https://travis-ci.org/Albert-Gao/veasy)

An elegant react form solution which focuses on form validation and more.

**[Documentation](https://albert-gao.github.io/veasy/)**

## Why use

- Declarative way to define your validation rule
- Comprehensive validation rule set and easy to extend
- Progressive validation mechanism.
- More than validation: Auto generate initial state, set fields with default value, get fields values, etc.
- Highly customizable: error message, default state, whatever you want.
- Clean JSX hierarchy, use your own field item component.
- Promise based architecture
- Easy to learn.

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
import Veasy, {createInitialState} from 'veasy';

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

Then wrap using our `<Veasy>` component:

```xml
<Veasy
  schema={formSchema}
  allState={this.state}
  update={(fieldState) => {this.setState(fieldState);}}
>
  <FieldItem name="title" />
</Veasy>
```

Congrats! Now your `FieldItem` will get the following `props` at runtime:

- `status`: For changing the look, ('normal', 'ok' and 'error')
- `errorText`: For showing the error message.
- `value`: Like how you bind the value for every `controlled component` :)

**And anytime the user changes something, the above 3 `props` will auto updated by `Veasy`, Enjoy :)**

There is even a `getFieldsValue()` method for you to get all the fields value, even you don't include all the fields in the schema, [we cover that case for you](https://albert-gao.github.io/veasy/#/collect-values) :)

> Tip: There is an extra `isFormOK` prop at the root level of `state` to indicate the status of the form according to all the fields defined in the schema.

Now you get it! Let's take several minutes to go through our **[documentation](https://albert-gao.github.io/veasy/)**.

## Chaining rules and Progressive validation mechanism

- Rules in schema are been processed one by one.
- Unless the value passes the first rule, `Veasy` won't trigger the check for the next rule.

The problem of real world validation is that sometimes we have so many rules in our code, but you can't just display all of them on the screen, it's scary :D

Instead, we will guide the user to the right path **by solving one problem a time**. A very simple example would be a field which expects an int, min and max.

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

If the user gives an `one`, `veasy` will stop at first rule and let the user know that it should be a number, and when their age is less than `16`, it will pass the first rule and stop at the second rule, which will change the error message to `should be older than 16`.

This example is simple, you can chain all the rules to build your own. And thanks to `React`, it all happens immediately. All you need to do is to declare a schema.
