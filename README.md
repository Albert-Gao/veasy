![Veasy.js](https://github.com/Albert-Gao/veasy/raw/master/docs/_media/logo.png)

# Veasy.js

[![Build Status](https://travis-ci.org/Albert-Gao/veasy.svg?branch=master)](https://travis-ci.org/Albert-Gao/veasy)

An easy to use yet comprehensive react form validation library which make your components tree clean.

## Why use

- Declarative way to define your validation rule
- Comprehensive validation rule set
- Progressive validation mechanism.
- More than validation: Auto generate initial state, set fields with default value, etc.
- Highly customizable: error message, default state, whatever you want.
- Clean JSX hierarchy, use your own field item component.
- Promise based architecture
- Easy to learn.

## A quick 3 steps how to

First,

```bash
npm install --save veasy
```

and
```javascript
import Veasy, {createInitialState} from 'veasy';
```

Suppose you have a form field component:

```xml
<FieldItem name="title" />
```

### Step 1: You can write a schema using json

```javascript
const formSchema = {
  title: {
    minLength: 10,
    maxLength: 20,
    exclude: 'bad words'
  }
};
```

### Step 2: Define an update function

```javascript
validateFields(state) { this.setState(state); }
```

### Step 3: Auto bind the props

Then wrap using our `<Veasy>` component:

```xml
<Veasy
  schema={formSchema}
  allState={this.state}
  update={this.validateFields}
>
  <FieldItem name="title" />
</Veasy>
```

Congrats! Now your `FieldItem` will get the following `props` in runtime:

- `status`: For changing the look, ('normal', 'ok' and 'error')
- `errorText`: For showing the error message.
- `value`: Like how you bind the value for every `controlled component` :)

**And anytime the user changes something, the above 3 `props` will auto updated by `Veasy`, Enjoy :)**

> Tip: There is an extra `isFormOK` prop at the root level of `state` to indicate the status of the form according to all the fields defined in the schema.

Now you get it! Let's take several minutes to go through our **[documentation](https://albert-gao.github.io/veasy/)**.

## Chaining rules and Progressive validation mechanism

- Rules in schema are been processed one by one.
- Unless the value passes the first rule, `Veasy` won't trigger the check for the next rule.

The problem of real world validation is that sometimes we have so many rules in our code, but you can't just display all of them on the screen, it's scary :D

Instead, we will guide the user to the right path **by validating the rule one by one**. A very simple example would be a field which expects an int, min and max.

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
