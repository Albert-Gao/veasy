# Collect values

Not every fields need to be validated. Things like radio button and combo-box, you can assign an initial value to them to make sure they always get a value. Or furthermore, you can add some checking like ensure the user has selected some values even it's the same as the initial value. But no matter which approach you gonna use, `veasy` could collect the final value from the state.

## [Recommend] for radio buttons and combo box

We recommend add a `schema` for fields like radio button or combo box, even you don't need to validate them, just add one line like this:

```javascript
const schema = {
  radioButtons: {
    default: 'yes'
  }
}
```

So you can enjoy the `createInitialValue()`, `getFieldsValue()` as well as `< VeasyForm >`.

!> A working code example could be checked at [here](https://github.com/Albert-Gao/veasy/tree/master/example).

## Or add an extra fields called `collectValues`

> You just need to add an extra field in the **`schema`** named `collectValues`, like this:

```javascript
{
    collectValues: {
        gender: 'genderInfo'
    }
}
```

Then later on, when you invoke `getFieldsValue()`, `veasy` will grab `this.state.genderInfo` and saved it to the result as `result.gender`.

And the state could be nested, `veasy` will find them.

```javascript
{
    collectValues: {
        gender: 'genderInfo.currentUser.gender.value.readyToSendValue'
    }
}
```

Still, when you invoke `getFieldsValue()`, `veasy` will grab `this.state.genderInfo.currentUser.gender.value.readyToSendValue` and saved it to the result as `result.gender`.

## What's next:

- Move on to [Step 2. initial state](/initial-state).

Or learn more about `schema`:

- To see [more examples of schema](/more-examples)
