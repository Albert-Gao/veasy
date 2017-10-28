# Veasy

A comprehensive react form solution which aims to eliminate all tedious logic.

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
- Easy to learn.

## Design concept

`Veasy` strives to add as little noise as possible to the JSX hierarchy. I believe validation is something that should be decoupled from the component's tree. That is exactly what `Veasy` does:

?> You pass `Veasy` a schema and `Veasy` updates your component automatically, passing the validation result and error message to the field item.

Even better, you can automatically bind the `props` to the field item so that it invokes `setState()` for you.

So, [let's begin.](/howto)

Or, check the working example at [here](https://github.com/Albert-Gao/veasy/tree/master/example).

> Tip: All the docs are written in different sections, and they are all very short, should take you 1 - 2 min per doc. :)