# FAQ

## How does the `veasy` handle my state underneath ?

To follow the best practice, We treat your state as immutable data, so every time a field gets changed, a new state object for this field will be dispatched to the `update` method you passed to the `<Veasy>`, or the `validate()` method if you try to do everything by yourself.

## Will `veasy` update my state whenever there is a change ?

Not really, we will check `status`, `errorText` and `value`, if they are all the same, we won't trigger the update.