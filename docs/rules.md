# Rules

It's all for testing string, really, but for the `Number rules`, `veasy` will convert it to number and check.

> It's recommend that you always add the `isInt` or `isFloat` if you are checking against the numbers.

For how to write the schema with rules, check the [schema](/schema) section.

## Notation Explanation

The type after colon indicates the type that that rule expects.

For instance:

- `minLength: int` means minLength expects an `int`.
- `Array<string>` means this rule expects an array of string.

```javascript
{
    bookType: {
        minLength: 1,
        inArray: ['S', 'M', 'L']
    }
}
```

## All rules

### String rules

- minLength: `int`
- maxLength: `int`
- include: `string`
- exclude: `string`
- startWith: `string`
- notStartWith: `string`
- endWith: `string`
- notEndWith: `string`

### Number rules

- min: `number`
- max: `number`
- equal: `number`
- notEqual: `number`
- isPositive: `boolean`
- isNegative: `boolean`
- isInt: `boolean`
- isDecimal: `boolean`
- isIntOrDecimal: `boolean`

### Normal rules

- inArray: `Array<string>`
- isRequired: `boolean`
  - Only affect the `isFormOK` currently, which means when it set to `false`, unless the field is `error`, the `isFormOK` will ignore its `status`.
- matchRegex: `regex`
- isEmail: `boolean`
- isUrl: `boolean`
- isCreditCard: `boolean`
- isHexColor: `boolean`
- notEmpty: `boolean`
- isIP: `string` within `v4`, `v6` or `all`


> Underneath, `veasy` use [is.js](http://is.js.org/), a fantastic micro check library, kudos to the creators!

Need some rules which not listed here or need to extend the current rule? Check our [repo](https://github.com/Albert-Gao/veasy) for creating a PR or issue, thanks. :)