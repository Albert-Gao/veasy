# How to use

## Brief

A high level abstraction of what you need to do would be:

1. Write your validation schema in `JSON`
1. Generate the initial state for the form component.
1. Bind 3 props to your field item component:
    - `status`: For changing the look, ('normal', 'ok' and 'error')
    - `errorText`: For showing the error message.
    - `value`: Like how you bind the value for every `controlled component` :)

**Now your field component could get the validation result anytime the user changes something, Enjoy :)**

Even better, `step 2` and `step 3` could be simplified by using our powerful `createInitialState()` and `<Veasy>` wrapper.

Now you get the big picture, let's take 1 minute to learn [how to write a schema](/schema).
