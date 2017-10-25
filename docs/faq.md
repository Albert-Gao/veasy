# FAQ

## How does the `veasy` handle my state underneath

To follow the best practice, We treat your state as immutable data, so every time a field gets changed, a new state object for this field will be dispatched to the `update` method you passed to the `<Veasy>`, or the `validate()` method if you try to do everything by yourself.

## Will `veasy` update my state whenever there is a change

Not really, we will check `status`, `errorText` and `value`, if they are all the same, we won't trigger the update.

## How to customize the error text

You could, check this [section](/customize-error-text)

## What about I want to add my own initial state

Very easy. Check this [section](/customize-add)

## I wanna put my own field state under the same name of `veasy` field state, how to do that

Very easy. Check this [section](/customize-reuse)

## How to collect all the values

Just call the `getFieldsValue()` function, check this [section](/collect-values)

## What about I want to collect some value from fields which not in the schema

We handle that case as well, check this [section](/collect-values)