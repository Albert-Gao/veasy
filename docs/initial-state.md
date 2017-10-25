# Step 2/3: Initial State

It's just like when you bind your `state` to the `React component`. But first you need to know what the state looks like.

## Create initial state with default value

`Veasy` will generate the initial state for you according to the defined `schema`. We eliminate boilerplate code as much as possible.

```javascript
import { createInitialState } from 'veasy';
const initialState = createInitialState(formSchema);
```

Easy, you just invoke the `createInitialState()` method with the `schema` you defined.
And it will result in the following `initialState`:

```javascript
{
  isFormOK: false,
  title: {
    status: 'normal',
    errorText: '',
    value: '',
  },
  age: {
    status: 'normal',
    errorText: '',
    value: '16',
  }
}
```

!> The `isFormOK` field will set to true once the `status` of every field (which defined in the schema) are equal to `ok`.

Wait, why the `age` field starts with a value of `16` rather than the empty string like `title`?

Yes, that's right, because you can define its default value when you define the schema:

```javascript
{
  age: {
    min: 19,
    max: 99,
    default: '16',
  }
}
```

It's that easy! You define it and that's how it will be :)

## How to get all the values

Check the [API](/api) section for more info of the `getFieldsValue()` method.

```javascript
import {getFieldsValue} from 'veasy';
const values = getFieldsValue(schema, state)
```

## What's next

- Move on to final [Step 3. binding](/binding) section

Or learn more about `state`:

- To learn how to [add your own state to the root level of generated state](/customize-add).
- To learn how to [add your own state as a child of field item state](/customize-reuse).
