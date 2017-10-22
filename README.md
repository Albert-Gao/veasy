[](_media/logo.png)

# Veasy.js

[![Build Status](https://travis-ci.org/Albert-Gao/veasy.svg?branch=master)](https://travis-ci.org/Albert-Gao/veasy)

An easy to use yet comprehensive react form validation library which make your components tree clean.

## Why use

- Declarative way to define your validation rule
- Comprehensive validation rule set
- Efficient checking system, will stop validating if any rule fails to pass.
- More than validation: Auto generate initial state, set fields with default value, etc.
- Highly customizable: error message, default state, whatever you want.
- Clean JSX hierarchy, nearly no wrapper components
- Promise based architecture
- Except the schema, just add a few lines, then you are good to go :)
- So easy to learn.

## A quick 3 steps how to

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
update(state) { this.setState(state); }
```

### Step 3: Auto bind the props

Then wrap using our `<Veasy>` component:

```xml
<Veasy
  schema={formSchema}
  allState={this.state}
  update={this.setState}
>
  <FieldItem name="title" />
</Veasy>
```

Congrats! Now your `FieldItem` will get the following `props` in runtime:

- `status`: For changing the look, ('normal', 'ok' and 'error')
- `errorText`: For showing the error message.
- `value`: Like how you bind the value for every `controlled component` :)

**And anytime the user changes something, your field component will get the validation result , Enjoy :)**

> Tip: There is an extra `isFormOK` prop at the root level of `state` to indicate the status of the form according to all the fields defined in the schema.

Now you get the big picture, let's take several minute to learn [how to write a schema](/schema).

## TODO:
- [ ] Add the `getFieldsValue` method.
- [x] Add the table of all rules.
- [x] Let user customize the error message.
- [ ] The `FieldItem` should be able to do more.
- [x] Add user's own state when calling `createInitialState()`