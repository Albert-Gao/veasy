# Step 3/3: Binding

Sweet! `Veasy` is now managing all the `state` for you. But it still leaves you to bind the `state` to the component. That is to say, you need to manually bind `status`, `errorText` and `value` to each field. Or do you? :)

## Auto binding

When you wrap your field components with `<VeasyForm>`, it will bind all 3 props for you! It doesn't matter whether the field is a direct child or not, `<VeasyForm>` will find it :)

!> **This is true, so long as the `name` of the element matches the name in the `schema`.**

```jsx
<VeasyForm
  schema={formSchema}
  allState={this.state}
  update={this.update}
>
  <FieldItem name="title" />
  <div>
    <FieldItem name="age" />
  </div>
</VeasyForm>
```

As you see, `<VeasyForm>` expects 3 `props`:

1. `schema`: This is the `schema` you just declared.
1. `allState`: This is the `state` of the current form component.
1. `update`: This is a method which wraps the `setState` and pass it to `Veasy`.

!> In fact, `<VeasyForm>` will just render a plain `<form>` for you. Feel free to add more `props` to the form, and they will all be added to the final `<form>` tag.

## Update method

Just like how you normally let the child component change the state of its parent component. You need to pass a handler function to `<Veasy>` in order to do the update, it will normally like this:

```javascript
// Don't forget to bind(this) in the constructor
update(state) {
  this.setState(state);
}
```

Or if you use the babel plugin: `transform-class-properties`, it could be simply written as:

```javascript
// No need to bind `this` now :)
updateState = newState => this.setState(newState);
```

Then `Veasy` will call this method whenever there is a update.

!> The `update` will be used when the following 3 events been triggered:

- `onChange`
- `onBlur`
- `onReset`

> `<VeasyForm>` will handle the above 3 events for you, all you need to do is to wrap the `setState` method and pass it as a `update` prop to `<VeasyForm>`. But for onReset you need a reset button: < button type='reset' >.

## Passing Props

In the above example, the two `<FieldItem>`'s named `title` and `age` will receive 3 extra props which were bound by `<Veasy>`:

1. `status`: `ok`, `error` and `normal` which you use to alter each field's appearance.
1. `errorText`: The error message for validation. Will be empty if all rules pass for this field.
1. `value`: The actual value bound to the `controlled component` of `React`.

This happens automatically whenever `Veasy` finds the field's name (`title` and `age`) in the `schema`:

```javascript
const formSchema = {
    title: {
        minLength: 2,
        maxLength: 6
    },
    age: {
      isInt: true,
      min: 10,
      max: 99
    }
};
```

That's it.

## Manual binding

It's just like how you bind the other components. You could do it like this:

```javascript
render() {
  return (
    <form>
      <FieldItem
        name="title"
        status={this.state.title.status}
        errorText={this.state.title.errorText}
        value={this.state.title.value}
      />
    </form>
  );
}
```

Or use the `destructing`:

```javascript
render() {
  const {
    title.status,
    title.errorText,
    title.text
  } = this.state;

  return (
    <form>
      <FieldItem
        name="title"
        status={title.status}
        errorText={title.errorText}
        value={title.value}
      />
    </form>
  );
}
```

Congrats!

That's pretty much all you need to know.

## What's next

- Do you know that you can DIY all the procedures here [by manually setup everything in order to gain more control](/diy)?
- Or, you can check the all rules in the [rules](/rules) section
