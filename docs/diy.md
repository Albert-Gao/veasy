# DIY

Although we do recommend auto-binding, you could do everything manually (though we're not sure why you would):

1. Declare your validation `schema`.
1. Generate a `veasy` instance in your component's constructor.
    - `this.veasy = VeasyClass(this, schema)`
1. Generate the initial state:
    - `this.veasy.createInitialState()`
1. Bind the 3 props from the state to your field component. If you have a field named `title`, the 3 `props` would be:
    - `this.state.title.status` : For changing the look according to validation result.
    - `this.state.title.errorText` : For displaying the error text.
    - `this.state.title.value` : Just like how you bind it normally for every form field.
1. Bind a `onChange` event handler in the `<form>` level to catch all the `onChange` events from the components.
    - It's just for triggering the validation procedure whenever the value changes:

    ```javascript
      onChange(e) {
        this.veasy.validate(e.target);
      }
    ```
1. You can get all the values by calling `this.veasy.getFieldsValue()`