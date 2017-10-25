# Customize state - Add

Before we start, remember one rule:

!> As long as you don't have conflicts with the 3 default state for a single field, `status`, `errorText` and `value`, you can do whatever you want. :)

`Veasy` will give you the ability to add your own state, otherwise, it's useless. Since validation will not be the only feature you want to implement for a form.

## Add your own state

Let's say you want to add some `state` like this:

```javascript
const myState = {
  isLoading: false,
  lifetime: 100,
  pageName: 'Profile',
  user: {
    name: 'default user',
    age: 16
  }
};
```

Just pass it as the **`2nd`** parameter:

```javascript
const initialState = createInitialState(
  formSchema,
  myState
);
```

Now this is the result `initialState`:

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
  },
  isLoading: false,
  lifetime: 100,
  pageName: 'Profile',
  user: {
    name: 'default user',
    age: 16
  }
}
```

## What's next:

- Move on to final [Step 3. binding](/binding) section

Or learn more about `state`:

- To learn how to [add your own state as a child of field item state](/customize-reuse).
