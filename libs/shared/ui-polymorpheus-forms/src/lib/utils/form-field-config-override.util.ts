import { FormArray, FormGroup } from '@angular/forms';
import { FormControlConfig, FormControlConfigMap } from '../models/form-field-control-config.model';
import { merge } from 'lodash-es';
import { FormControlType, FormGroupConfig } from '../models';
import { DeepPartial } from '@shared/util-types';

export const overrideField =
  <Type extends FormControlType>(type: Type) =>
  <Form extends FormGroup | FormArray, Key extends keyof Form['controls'] | number>(
    source: FormControlConfig<Form, Key>,
    override: Omit<DeepPartial<FormControlConfigMap<Form, Key>[Type]>, 'type'>,
  ): FormControlConfig<Form, Key> => {
    return merge<FormControlConfig<Form, Key>, FormControlConfig<Form, Key>, FormControlConfig<Form, Key>>(
      {} as FormControlConfig<Form, Key>,
      source,
      { ...override, type } as FormControlConfig<Form, Key>,
    );
  };

export const overrideAsTextInput = overrideField('InputText');
export const overrideAsSingleSelect = overrideField('SingleSelect');
export const overrideAsInputRadioGroup = overrideField('InputRadioGroup');
export const overrideAsTextarea = overrideField('TextArea');
export const overrideAsAutocomplete = overrideField('Autocomplete');
export const overrideAsCheckbox = overrideField('Checkbox');

export const overrideFormGroup = <Form extends FormGroup>(
  source: FormGroupConfig<Form>,
  override: DeepPartial<FormGroupConfig<Form>>,
): FormGroupConfig<Form> => {
  return merge<FormGroupConfig<Form>, FormGroupConfig<Form>, FormGroupConfig<Form>>(
    {} as FormGroupConfig<Form>,
    source,
    override as FormGroupConfig<Form>,
  );
};
