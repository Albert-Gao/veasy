# How to use

## Brief

At a high level, here's what you'll be doing:

1. `npm install --save veasy`
1. Define a `JSON` validation schema
1. Generate the initial state of the form component.
1. Bind 3 props to your field item component:
    - `status`: Use to affect the field's appearance, ('normal', 'ok' and 'error')
    - `errorText`: Use as the error message.
    - `value`: Use to bind the field's value, making it a `controlled component` :)

**Now your field component could get the validation result anytime the user changes something, Enjoy :)**

Even better, `step 3` and `step 4` could be simplified by using our powerful `createInitialState()` and `<VeasyForm>` wrapper.

> Tip: There is an extra `isFormOK` prop at the root level of `state` to indicate the status of the form according to all the fields defined in the schema.


Now you get the big picture, let's take 1 minute to learn [how to write a schema](/schema).
