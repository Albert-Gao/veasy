# Veasy

An elegant react form solution which focuses on form validation and more.

## Features

- Declarative way to define your validation rule
- Comprehensive validation rule set
- Progressive validation mechanism.
- More than validation: Auto generate initial state, set fields with default value, get fields values, etc.
- Highly customizable: error message, default state, whatever you want.
- Clean JSX hierarchy, use your own field item component.
- Promise based architecture
- Easy to learn.

## Design concept

`Veasy` try to add as less noise as possible to the JSX hierarchy. I believe validation is something which should decoupled from the components tree. That's all for what `Veasy` does:

?> You give `Veasy` the schema, and `Veasy` will update your component automatically, it will update the field item with the validation result and its according error message.

Even better, it could automatically bind the `props` to field item and invoke `setState()` for you.

So, [let's begin.](/howto)

> Tip: All the docs are written in different sections, and they are all very short, should take you 1 - 2 min per doc. :)