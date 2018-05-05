export type TargetType = {
  value: mixed,
  name: string
};

export type UpdateFuncType = (mixed) => void;

export type SchemaType = {
  collectValues? : {}
};

export type FieldStateType = {
  value: mixed,
  status: 'normal' | 'ok' | 'error',
  errorText: string
};

export type ComponentStateType = {
  [string] : FieldStateType,
  isFormOK: boolean
};


export type FieldSchemaType = {
  default?: mixed,
  min?: number
};


export type HandlerFuncType = (mixed) => boolean;

export type MatcherType = {
  [string]: HandlerFuncType
};
