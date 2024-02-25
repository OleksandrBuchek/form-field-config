import { FormGroup } from '@angular/forms';
import { InputAmountProps } from '../models';
import { injectControlConfig } from './control-config.injector';

export const injectTextAlignClassName = <Form extends FormGroup, Key extends keyof Form['controls']>():
  | 'text-right'
  | 'text-left' => {
  const props = (injectControlConfig<Form, Key>().props as Partial<InputAmountProps>) ?? {};

  const textAlign = props.textAlign ?? 'left';

  return textAlign === 'right' ? 'text-right' : 'text-left';
};
