# Step 3/3: Binding

Sweet! `Veasy` is now managing all the `state` for you. But it still leaves you to bind the `state` to the component. That is to say, you need to manually bind `status`, `errorText` and `value` to each field. Or do you? :)

## Auto binding

When you wrap your field components with `<Veasy>`, it will bind all 3 props for you! It doesn't matter whether the field is a direct child or not, `<Veasy>` will find it :)

!> **This is true, so long as the `name` of the element matches the name in the `schema`.**

```jsx
<Veasy
  schema={formSchema}
  allState={this.state}
  update={this.update}
>
  <FieldItem name="title" />
  <div>
    <FieldItem name="age" />
  </div>
</Veasy>
```

As you see, `<Veasy>` expects 3 `props`:

1. `schema`: This is the `schema` you just declared.
1. `allState`: This is the `state` of the current form component.
1. `update`: This is a method which wraps the `setState` and pass it to `Veasy`.

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
