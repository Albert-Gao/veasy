# Step 1/3: Schema

?> The schema is a set of rules defined in JSON, describing how to validate each field

## Plain schema in JSON

Let's say you have a text input `<input name='title'>` or `<FieldItem name='age'>`

And you want validate them:

- `title` length to be between `2` and `5`
- `age` to be a `number`, and between `10` and `99`

Easy. Just define your schema like this:

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

!> Tip: Don't worry about that `isInt` rule, `Veasy` knows field values are always a string and handles the conversion for you :)

Now, when the value of `title` is not matching the rule, the following `props` will pass to your `title` component:

```javascript
{
  status: 'error',
  errorText: 'Length of title must be greater than 2, current: 1',
  value: 'a'
}
```

It looks like this when all field-level rules pass:

```javascript
{
  status: 'ok',
  errorText: '',
  value: 'ab'
}
```

## Chaining rules and Progressive validation mechanism

- Rules in schema are processed one-by-one.
- Unless the value passes the first rule, `Veasy` won't bother checking the next.

Many forms in the wild display all errors at once, which can be many! That's scary!

Instead, we guide the user through the form **by validating each rule one-by-one**. As a very simple example, consider this field which expects an int, min and max.

Your schema is like this:

```javascript
{
  age: {
    isInt: true,
    min: [16, 'should be older than 16'],
    max: 99
  }
}
```

If the user enters `one`, `veasy` will stop at first rule and let the user know that it should be a number. If they then enter `1`, `veasy` will inform them that they `should be older than 16`, and so on until all rules are valid.

This example is simple, you can chain all the rules to build your own. And thanks to `React`, it all happens immediately. All you need to do is to declare a schema.

This is pretty much all you need to start with a `schema`.

## What's next

- Move on to [Step 2. initial state](/initial-state)

Or, learn more about schema:

- [customize the error message](/customize-error-text)
- [collect values from non-veasy state](/collect-values)
- [more examples of schema](/more-examples)
