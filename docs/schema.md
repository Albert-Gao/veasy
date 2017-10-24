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

## Chaining rules and Progressive validation mechanism

- Rules in schema are been processed one by one.
- Unless the value passes the first rule, `Veasy` won't trigger the check for the next rule.

The problem of real world validation is that sometimes we have so many rules in our code, but you can't just display all of them on the screen, it's scary :D

Instead, we will guide the user to the right path **by validating the rule one by one**. A very simple example would be a field which expects an int, min and max.

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

If the user gives an `one`, `veasy` will stop at first rule and let the user know that it should be a number, and when their age is less than `16`, it will pass the first rule and stop at the second rule, which will change the error message to `should be older than 16`.

This example is simple, you can chain all the rules to build your own. And thanks to `React`, it all happens immediately. All you need to do is to declare a schema.

This is pretty much all you need to start with a `schema`.

## What's next

- Move on to [Step 2. initial state](/initial-state)

Or, learn more about schema:

- [customize the error message](/customize-error-text)
- [collect values from non-veasy state](/collect-values)
- [more examples of schema](/more-examples)
