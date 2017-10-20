# Manual binding

## Step by step

1.  Write a schema like below, `title` is the `name` of the field item you want to check, see how easy it could be to validate the min and max length of a string?

```javascript
const formSchema = {
    title: {
        minLength: 2,
        maxLength: [5, 'Too much words']
    }
};
```

Easy, huh? If you define the value of a rule as an array, `EasyV` will take the 2nd parameter as the custom error message, wow! :)

2. In the constructor of the form component, add this 2 lines, one for binding the schema to `easyV` and one for generating the initial state.

```javascript
constructor() {
    super();
    this.validator = new FormValidator(this, formSchema);
    this.state = this.validator.createInitialState();
  }
```

3. Bind a `onChange` event handler to your form component like this:

``` javascript
<form action="" onChange={this.handleFieldChange}>
```

4. Invoke the validation methods inside the handler:

```javascript
handleFieldChange = e => {
    e.preventDefault();
    return this.validator.validate(e.target);
  };
```

5. Wrap all your field item inside the `<FieldsBinding>` component.

```xml
<BindStatus schema={formSchema} state={this.state}>
    <TextInput
        name="title"
        label="Title"
        placeHolder="Put the title of item here"
    />
</BindStatus>
```

The `FieldsBinding` component will pass 2 `props` to your field item:

- status: `ok`, `error`, `normal`, which you can use inside the field item component to change the CSS style according the status.
- errorText: It will display the error message.

6. Then you are good to go, at runtime, everytime the value of the `title` input changes, it will be validated by `easyV` and then set the `status` and `errorText` back to the `props` of the `title` component. It will jusy works. This is pretty much all of it.

## How does easyV.js work

1. Get your defined rule sets from schema.
1. Get the value to check from `onChange` method
1. The background `matchRunner` will match your schema against the value.
1. Validation result will be saved to the state, and calling `setState` automatically. Including:
    - Final value
    - Field status: `normal`, `ok`, `error`
    - Error text
    - Form status according to all the status of the fields item.

## FAQ

- Flat state hierarchy, and you can merge your state to our state, no conflicts.


## TODO:
- [ ] Add the `getFieldsValue` method.
- [ ] Add the table of all rules.
- [ ] Need to add a minimal working example.
- [ ] Let user define the name of `status`
- [x] Let user customize the error message.
- [ ] The `FieldItem` should be able to do more.
- [x] Add user's own state when calling `createInitialState()`