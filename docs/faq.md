# FAQ

## How does the `veasy` handle my state underneath

To follow the best practice, We treat your state as immutable data, so every time a field gets changed, a new state object for this field will be dispatched to the `update` method you passed to the `<Veasy>`, or the `validate()` method if you try to do everything by yourself.

## Will `veasy` update my state whenever there is a change

Not really, we will check `status`, `errorText` and `value`, if they are all the same, we won't trigger the update.

## So `veasy` will handle the `onChange`, what about `onBlur` event

The validation will be triggered when the `onBlur` been triggered.

## What about the `reset` button

`<VeasyForm>` handles the `onReset` event, it will reset the state to the initialState. All you need to do is to add a button which `type` is `reset`:

```html
<button type='reset'> Reset </button>
```

## How to customize the error text

You could, check this [section](/customize-error-text)

## What about I want to add my own initial state

Very easy. Check this [section](/customize-add)

## I wanna put my own field state under the same name of `veasy` field state, how to do that

Very easy. Check this [section](/customize-reuse)

## How to collect all the fields values

Just call the `getFieldsValue()` function, check this [section](/collect-values)

## What about I want to collect some value from fields which not included in the schema

We handle that case as well, check this [section](/collect-values)

## How to handle radio buttons or combo box

Check this [section](/collect-values?id=recommend-for-radio-buttons-and-combo-box)
Or, check the working code example at [here](https://github.com/Albert-Gao/veasy/tree/master/example).
