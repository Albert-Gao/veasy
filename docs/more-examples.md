# More examples

What about an email?

```javascript
const formSchema = {
    email: {
        isEmail: [true, 'Expect a valid email']
        notEndWith: '@bad-guy.com',
        exclude: ['bad', 'Don`t say bad words plz :)']
    }
};
```

Or a highly restricted field?

```javascript
const formSchema = {
    favDomain: {
        isUrl: true,
        enum: ['a.com', 'b.com', 'c.com']
        exclude: ['bad', 'Don`t say bad words plz :)']
    }
};
```

If the value is not within `enum`, `status` will be `error`. And you can define your own error message too.

```javascript
enum: [
  ['a.com', 'b.com', 'c.com'],
  'Please choose between the 3'
]
```

We currently have `23` rules for use, including common case for `string`, `number` (we know it's a `string number` :) ) and `common regexp` like `isCreditCard`, `isIP`, etc.

You can define your own `regex` as well:

```javascript
favDomain: {
    matchRegex: /^([a-z0-9]{5,})$/,
}
```

## What's next

- Move on to [initial state](/initial-state).
