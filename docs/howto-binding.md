# Step 3/3: Binding

Even though `Veasy` could manage all the `state` for you and generate them. But you still need to bind the `state` to the component, I mean, for that `status`, `errorText` and `value`. Or, is that the case? :)

## Auto binding

You just need to wrap all your field components with the `<Veasy>`, then it will bind that 3 props for you. No matter it's a direct child or not, `<Veasy>` will find it :)

!> **As long as the `name` of the element matches the name in the `schema`.**

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
1. `update`: It's just a method which wraps the `setState` and pass it to `Veasy`.

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
updateState = newState => this.setState(newState);
```

Then `Veasy` will call this method whenever there is a update.

## Passing Props

In the above example, the 2 `<FieldItem>` named `title` and `age` will get 3 extra props which bind by the `<Veasy>`:

1. `status`: `ok`, `error` and `normal` which you use to modify the looking.
1. `errorText`: The error message for validation. Will be empty if all rules pass for this field.
1. `value`: The normal value binding for the `controlled component` of `React`.

This could happen simply because `Veasy` could find the same name (`title` and `age`) appears in the `schema`:

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
