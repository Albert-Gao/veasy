# Step 1/3: Schema

?> A schema is a set of rules written in JSON which describes how you want to validate your field.

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

!> Tip: Don't worry about that `isInt` rule, EasyV knows it's always a string from a form field, we handle that converting as well :)

Now, when the value of `title` is not matching the rule, the following `props` will pass to your `title` component:

```javascript
{
  status: 'error',
  errorText: 'Length of title must be greater than 2, current: 1',
  value: 'a'
}
```

It looks like this when all rule pass:

```javascript
{
  status: 'ok',
  errorText: '',
  value: 'a'
}
```

## Chaining rules

- Rules in schema are been processed one by one.
- Unless the value passes the first rule, `Veasy` won't trigger the check for the next rule.

> Tip: This is for a fast processing. And you can use this `chaining` to declare your progressive validation defense: `isInt` to instruct the user the value must be a number, then `min` to set its min and `max` to set its min. So the user could get there more smoothly.

This is pretty much all you need to start with a `schema`.

## What's next

- Move on to [Step 2. initial state](/initial-state)

Or, learn more about schema:
- [customize the error message](/customize-error-text)
- [more examples of schema](/more-examples)
