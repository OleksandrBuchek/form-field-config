import { FormGroup } from '@angular/forms';
import { FieldWithSuffixAndPrefix } from '../models';
import { injectControlConfig } from './control-config.injector';
import { AsSignals } from '@shared/util-types';
import { asSignal } from '@shared/util-rxjs-interop';

export const injectSuffixAndPrefix = <Form extends FormGroup, Key extends keyof Form['controls']>(): AsSignals<{
  preffix: string | undefined;
  suffix: string | undefined;
}> => {
  const props = (injectControlConfig<Form, Key>().props as Partial<FieldWithSuffixAndPrefix>) ?? {};

  return {
    preffix: asSignal(props.preffix),
    suffix: asSignal(props.suffix),
  };
};
