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
    - greater than or equal
- maxLength: `int`
    - less than or equal
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

- default: `Any`
  - If you set this value, then the `createInitialState()` will return you an initial state with this default value. It will trigger the validation as well. Because it's a default value. You can add a `placeholder` to your `input` component if a hint is all you want.
- inArray: `Array<string>`
- isRequired: `boolean`, default to `true`
  - Only affect the `isFormOK` currently, which means when it set to `false`, unless the field is `error`, the `isFormOK` will ignore its `status`.
- matchRegex: `regex`
- isEmail: `boolean`
- isUrl: `boolean`
- isCreditCard: `boolean`
- isHexColor: `boolean`
- notEmpty: `boolean`
- isIP: `string` within `v4`, `v6` or `all`


### Special rules
- beforeValidation: `(fieldValue) => fieldValue`
  - This is a function which will executed before validation.
  - It will get a value, and return a value.
  - The returned value will be used for this field.
  - Such that, you can change field to do some formatting thing before validation happens.
- reliesOn: `Schema`
  - Here you can let a field A `reliesOn` another field B (which should exists in the state) with new rules, if the validation fails, then field A will be marked as `error`, because it `reliesOn` field B. 
  - No matter how you defines the rules for field B in the root schema, inside `reliesOn`, you can define new rules. Any `veasy` rules will be supported!
  - This won't affect the rules for fieldB in the `schema`
  - Example
      ```javascript
      {
           fieldA: {
                minLength: 4,
                maxLength: 6,
                reliesOn: { 
                    fieldB: {
                         // you can use all `veasy` rules to validate against fieldB, 
                         // if it fails, fieldA will be `error` because it `reliesOn` fieldB
                         startWith: 'a'
                    }
                }
           },       
           fieldB: {
              minLength: 1,
              maxLength: 3
           }
      }
      ```
- onlyWhen: `Schema`
  - The syntax is as same as `reliesOn`!
  - But if the validation in `onlyWhen` returns `false`, then this field will be ruled out from validation even it gets a wrong value.
  - Which mean, the validation happens `onlyWhen` this rule itself passes validation.
  - Example
      ```javascript
      {
           fieldA: {
                minLength: 4,
                maxLength: 6,
                onlyWhen: { 
                    fieldB: {
                         // you can use all `veasy` rules to validate against fieldB, 
                         // if it fails, fieldA won't be included in validation because its validation will happen when `onlyWhen` pass the check
                         startWith: 'a'
                    }
                }
           },       
           fieldB: {
              minLength: 1,
              maxLength: 3
           }
      }
      ```
      
> Underneath, `veasy` use [is.js](http://is.js.org/), a fantastic micro check library, kudos to the creators!

Need some rules which not listed here or need to extend the current rule? Check our [repo](https://github.com/Albert-Gao/veasy) for creating a PR or issue, thanks. :)
