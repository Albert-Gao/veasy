# How to use the example

Create a new project using [Create react app](https://github.com/facebookincubator/create-react-app).

```bash
npm install -g create-react-app

create-react-app my-app
cd my-app/
npm start
```

And copy all files into the `src` folder

Then `yarn start` or `npm run start`

It will show two `TextInput` and three `RadioButton`.

You can see how `veasy` can enable:

- Generate initial state
- Validation
- Reset
- Whole form status check
- `getFieldsValue()`

`FullBindingTextInput` and `SimpleBindingTextInput`:

They are all the same, the only difference is `SimpleBindingTextInput` use `...rest` to handle the `placeholder`, `value` and `onChange`.