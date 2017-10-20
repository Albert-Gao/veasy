# Veasy

A simple yet comprehensive validation solution for React.

## Features

- Declarative way to define your validation rule
- Comprehensive validation rule set
- Efficient checking system, will stop validating if any rule fails to pass.
- More than validation: Auto generate initial state, set fields with default value, etc.
- Highly customizable: error message, default state, whatever you want.
- Clean JSX hierarchy, nearly no wrapper components
- Promise based architecture
- Except the schema, just add a few lines, then you are good to go :)
- So easy to learn.

## Design concept

`easyV` try to add as less noise as possible to the JSX hierarchy. I believe validation is something which should decoupled from the components tree. That's all for what `easyV.js` does:

?> You give `EasyV` the schema, and `EasyV` will update your component automatically, it will update the field item with the validation result and its according error message.

Even better, it could automatically bind the `props` to field item and invoke `setState()` for you.

So, [let's begin.](/)