import { FieldHelperProps, FieldInputProps, FieldMetaProps, useField } from 'formik';

export function getTypedField<FormFields>() {
  return function TypedField<FormFieldName extends keyof FormFields>({
    children,
    name,
  }: {
    name: FormFieldName;
    children: (o: {
      field: FieldInputProps<FormFields[FormFieldName]>;
      meta: FieldMetaProps<FormFields[FormFieldName]>;
      helpers: FieldHelperProps<FormFields[FormFieldName]>;
    }) => JSX.Element;
  }) {
    const [field, meta, helpers] = useField<FormFields[FormFieldName]>(name as string);

    return children({ field, meta, helpers });
  };
}
