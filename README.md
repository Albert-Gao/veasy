# easyV.js

An easy to use yet comprehensive react form validation library which make your components tree clean.

## Why use

- Declarative way to define your validation rule
- Comprehensive validation rule set
- Default error message along with customizable error message
- Promise based architecture
- Clean JSX hierarchy, nearly no wrapper components
- Except the schema, just add a few lines, then you are good to go :)


I found that the other existing react form validation solution either requires to add so many different kinds of wrapper components or using `props` extensively so the JSX becomes pretty heavy, they all add too much noise to the JSX hierarchy.

I think validation is something which should decoupled from the components tree. That's all for what `easyV.js` does:

>You give `EasyV` the schema, and `EasyV` will update your component automatically, it will update the field item with the validation result and its according error message.

Even better, it could automatically bind the `props` to field item and invoke `setState()` for you.

## How to use

### Brief

A high level abstraction of what you need to do would be:

1. Write your schema
1. Let your form field component handle the following `props`:
 - `status`: To define the look. (You just need to change its CSS class, according to the following string value):
     - `ok`: validation pass and value is not empty,
     - `error`: validation error,
     - `normal`: empty, haven't touched by the user.
 - `errorText`: To show the error message.
1. Bind the state by yourself or use `<EasyV>` wrapper to auto binding
1. Then everything happens automatically :)

### Step by step

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