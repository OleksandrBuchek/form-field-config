/* eslint-disable @typescript-eslint/naming-convention */

import { FormArray, FormGroup } from '@angular/forms';
import { UIOption, ValueOrFactory, ValueOrReactive } from '@shared/util-types';
import { Observable } from 'rxjs';
import { FormFieldConfigBase } from './form-field-config-base.model';
import { IsNonNullableField } from './is-non-nullable-field.model';
import { FormControlConfigValidationWithParams, FormFieldValidationBase } from './form-field-validation.model';
import { FormControlType } from './form-control-type.model';
import { ThemePalette } from '@angular/material/core';

export interface FieldPropsBase {
  placeholder: string | Observable<string>;
  autocomplete?: string | Observable<string>;
  autofocus?: boolean;
  hint?: ValueOrFactory<ValueOrReactive<string>>;
}

export interface FieldWithSuffixAndPrefix {
  suffix: ValueOrFactory<ValueOrReactive<string>>;
  preffix: ValueOrFactory<ValueOrReactive<string>>;
}

export type FieldColor = ThemePalette;

export interface WithColorProps {
  color: FieldColor;
}

export interface WithTextAlign {
  textAlign: 'left' | 'right';
}

export type TextInputTypeAttribute = (typeof TextInputTypeAttribute)[keyof typeof TextInputTypeAttribute];

export const TextInputTypeAttribute = {
  password: 'password',
  text: 'text',
} as const;

export interface TextInputProps extends FieldPropsBase, Partial<FieldWithSuffixAndPrefix> {
  type?: TextInputTypeAttribute;
}

export interface PropsWithOptions<Form extends FormGroup | FormArray> {
  options: ((form: Form) => ValueOrReactive<Array<UIOption<unknown>>>) | ValueOrReactive<Array<UIOption<unknown>>>;
}

export interface AutocompleteProps<Form extends FormGroup | FormArray>
  extends Partial<PropsWithOptions<Form>>,
    FieldPropsBase {
  displayWith?: (value: any) => string;
}

export interface SingleSelectProps<Form extends FormGroup | FormArray, Key extends keyof Form['controls'] | number>
  extends FieldPropsBase,
    PropsWithOptions<Form> {
  compareWithFn?: (a: Required<Form['value']>[Key], b: Required<Form['value']>[Key]) => boolean;
  hideSingleSelectionIndicator?: boolean;
  multiple?: boolean;
}

export interface FormControlConfigBase<Form extends FormGroup | FormArray, Key extends keyof Form['controls'] | number>
  extends Omit<FormFieldConfigBase<Form, Key>, 'validation'> {
  label: string | Observable<string>;
  nonNullable: IsNonNullableField<Form, Key>;
  defaultValue: Required<Form['value']>[Key];
  tooltip?: Partial<{
    text: string;
    position: string;
  }>;
  extra?: Partial<{
    e2eAttr: string;
  }>;
}

export interface SingleSelectFormControlConfig<
  Form extends FormGroup | FormArray,
  Key extends keyof Form['controls'] | number,
> extends FormControlConfigBase<Form, Key> {
  type: 'SingleSelect';
  props: SingleSelectProps<Form, Key>;
  validation?: Partial<FormFieldValidationBase<Form>>;
}

export interface InputRadioGroupProps<Form extends FormGroup | FormArray>
  extends Partial<WithColorProps>,
    PropsWithOptions<Form> {}

export interface InputRadioFormControlConfig<
  Form extends FormGroup | FormArray,
  Key extends keyof Form['controls'] | number,
> extends FormControlConfigBase<Form, Key> {
  type: 'InputRadioGroup';
  props?: InputRadioGroupProps<Form>;
  validation?: Partial<FormFieldValidationBase<Form>>;
}

export type TextFieldFormControlConfigValidationParams = {
  minLength: number;
  maxLength: number;
};

export type NumberFieldFormControlConfigValidationParams = {
  min: number;
  max: number;
};

export type TextFieldFormControlConfigValidation<
  Form extends FormGroup | FormArray,
  Key extends keyof Form['controls'] | number,
> = FormControlConfigValidationWithParams<Form, Key, TextFieldFormControlConfigValidationParams>;

export type NumberFieldFormControlConfigValidation<
  Form extends FormGroup | FormArray,
  Key extends keyof Form['controls'] | number,
> = FormControlConfigValidationWithParams<Form, Key, NumberFieldFormControlConfigValidationParams>;

export interface InputTextFormControlConfig<
  Form extends FormGroup | FormArray,
  Key extends keyof Form['controls'] | number,
> extends FormControlConfigBase<Form, Key> {
  type: 'InputText';
  props: TextInputProps;
  validation?: Partial<TextFieldFormControlConfigValidation<Form, Key>>;
}

export interface InputNumberProps extends FieldPropsBase, Partial<FieldWithSuffixAndPrefix> {
  step?: number;
}

export interface InputNumberFormControlConfig<
  Form extends FormGroup | FormArray,
  Key extends keyof Form['controls'] | number,
> extends FormControlConfigBase<Form, Key> {
  type: 'InputNumber';
  props: InputNumberProps;
  validation?: Partial<NumberFieldFormControlConfigValidation<Form, Key>>;
}

export interface InputAmountProps extends FieldPropsBase, Partial<FieldWithSuffixAndPrefix>, Partial<WithTextAlign> {}

export interface InputAmountFormControlConfig<
  Form extends FormGroup | FormArray,
  Key extends keyof Form['controls'] | number,
> extends FormControlConfigBase<Form, Key> {
  type: 'InputAmount';
  props: InputAmountProps;
  validation?: Partial<NumberFieldFormControlConfigValidation<Form, Key>>;
}

export interface TextAreaProps extends FieldPropsBase {
  autosize?: boolean;
  minRows?: number;
  maxRows?: number;
}

export interface TextAreaFormControlConfig<
  Form extends FormGroup | FormArray,
  Key extends keyof Form['controls'] | number,
> extends FormControlConfigBase<Form, Key> {
  type: 'TextArea';
  props: TextAreaProps;
  validation?: Partial<TextFieldFormControlConfigValidation<Form, Key>>;
}

export interface AutocompleteFormControlConfig<
  Form extends FormGroup | FormArray,
  Key extends keyof Form['controls'] | number,
> extends FormControlConfigBase<Form, Key> {
  type: 'Autocomplete';
  props: AutocompleteProps<Form>;
  validation?: Partial<TextFieldFormControlConfigValidation<Form, Key>>;
}

interface CheckboxProps extends WithColorProps {}

export interface CheckboxFormControlConfig<
  Form extends FormGroup | FormArray,
  Key extends keyof Form['controls'] | number,
> extends FormControlConfigBase<Form, Key> {
  type: 'Checkbox';
  props: CheckboxProps;
  validation?: never;
}

export interface DatepickerProps extends FieldPropsBase {
  icon?: string;
}

export type DatepickerFormControlConfigValidationParams = {
  minDate: Date | string;
  maxDate: Date | string;
};

export type DatepickerFormControlConfigValidation<
  Form extends FormGroup | FormArray,
  Key extends keyof Form['controls'] | number,
> = FormControlConfigValidationWithParams<Form, Key, DatepickerFormControlConfigValidationParams>;

export interface DatepickerFormControlConfig<
  Form extends FormGroup | FormArray,
  Key extends keyof Form['controls'] | number,
> extends FormControlConfigBase<Form, Key> {
  type: 'Datepicker';
  props: DatepickerProps;
  validation?: Partial<DatepickerFormControlConfigValidation<Form, Key>>;
}

export type FormControlConfig<Form extends FormGroup | FormArray, Key extends keyof Form['controls'] | number> =
  | SingleSelectFormControlConfig<Form, Key>
  | InputRadioFormControlConfig<Form, Key>
  | InputTextFormControlConfig<Form, Key>
  | TextAreaFormControlConfig<Form, Key>
  | AutocompleteFormControlConfig<Form, Key>
  | CheckboxFormControlConfig<Form, Key>
  | InputNumberFormControlConfig<Form, Key>
  | DatepickerFormControlConfig<Form, Key>
  | InputAmountFormControlConfig<Form, Key>;

export type FormControlConfigMap<Form extends FormGroup | FormArray, Key extends keyof Form['controls'] | number> = {
  [FormControlType.SingleSelect]: SingleSelectFormControlConfig<Form, Key>;
  [FormControlType.InputRadioGroup]: InputRadioFormControlConfig<Form, Key>;
  [FormControlType.InputText]: InputTextFormControlConfig<Form, Key>;
  [FormControlType.TextArea]: TextAreaFormControlConfig<Form, Key>;
  [FormControlType.Autocomplete]: AutocompleteFormControlConfig<Form, Key>;
  [FormControlType.Checkbox]: CheckboxFormControlConfig<Form, Key>;
  [FormControlType.InputNumber]: InputNumberFormControlConfig<Form, Key>;
  [FormControlType.Datepicker]: DatepickerFormControlConfig<Form, Key>;
  [FormControlType.InputAmount]: InputAmountFormControlConfig<Form, Key>;
};
