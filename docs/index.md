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

`Veasy` strives to add as little noise as possible to the JSX hierarchy. I believe validation is something that should be decoupled from the component's tree. That is exactly what `Veasy` does:

?> You pass `Veasy` a schema and `Veasy` updates your component automatically, passing the validation result and error message to the field item.

Even better, you can automatically bind the `props` to the field item so that it invokes `setState()` for you.

So, [let's begin.](/howto)

> Tip: All the docs are written in different sections, and they are all very short, should take you 1 - 2 min per doc. :)