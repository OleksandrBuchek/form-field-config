import { FormArray, FormGroup } from '@angular/forms';

export const getFormForConfig = <Form extends FormGroup | FormArray, Key extends keyof Form['controls'] | number>(
  form: Form,
  key: Key,
): Form | Form['controls'][Key] => {
  const result =
    form.get(key as string) instanceof FormGroup || form.get(key as string) instanceof FormArray
      ? form.get(key as string)
      : form;

  return result as Form | Form['controls'][Key];
};
