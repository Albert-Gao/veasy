# Rules

It's all for testing string, really, but for the `Number rules`, `veasy` will convert it to number and check.
For how to use the rules, check the `schema` section.

## String rules

- minLength: int
- maxLength: int
- include: string
- exclude: string
- startWith: string
- notStartWith: string
- endWith: string
- notEndWith: string

## Number rules

- min: number
- max: number
- equal: number
- notEqual: number
- isPositive: boolean
- isNegative: boolean
- isInt: boolean

## Normal rules

- enum: [string]
- matchRegex: regex
- isEmail: boolean
- isUrl: boolean
- isCreditCard: boolean
- isHexColor: boolean
- notEmpty: boolean
- isIP: `v4`, `v6` or `all`

Underneath, `veasy` use [is.js](http://is.js.org/), a fantastic micro check library, kudo to the creators!
