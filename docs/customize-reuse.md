# Customize State - reuse

Wait, I want my own state inside that `title` and `age`.
Wow, I know, I know, after all, it's your component. And lucky you, `EasyV` handles that too. :)

So, instead of:

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

You want to add more `state` to `title` and `age`, as well as the previous one.

Still easy. Just define:

```javascript
const myState = {
  title: {
    oldTitle: 'old',
    newTitle: 'new'
  },
  age: {
    source: 'db'
  },
  user: {
    isNew: false,
    city: 'Dunedin'
  }
  isLoading: false
};
```

And pass it as the 2nd parameter:

```javascript
const initialState = createInitialState(
  formSchema,
  myState
);
```

Now this is the final result:

```javascript
{
  isFormOK: false,
  title: {
    status: 'normal',
    errorText: '',
    value: '',
    oldTitle: 'old',
    newTitle: 'new'
  },
  age: {
    status: 'normal',
    errorText: '',
    value: '16',
    source: 'db'
  },
  user: {
    isNew: false,
    city: 'Dunedin'
  }
  isLoading: false
}
```

Cool!

Remember that rule:

!> As long as you don't have conflicts with the 3 default state for a single field, `status`, `errorText` and `value`, you can do whatever you want. :)

And feel free to use the `state`, it's all yours now :)

Now you can:

- Move on to final [binding](/binding) section
