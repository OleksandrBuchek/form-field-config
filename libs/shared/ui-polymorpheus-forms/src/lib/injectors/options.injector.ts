import { inject, Signal } from '@angular/core';
import { UIOption } from '@shared/util-types';
import { PropsWithOptions } from '../models';
import { injectControlConfig } from './control-config.injector';
import { FormGroup } from '@angular/forms';
import { FormGroupFacade } from '../facade';
import { asSignal } from '@shared/util-rxjs-interop';
import { isFactoryFunction } from '@shared/util-helpers';

export const injectFieldOptions = <Form extends FormGroup>(): Signal<UIOption<unknown>[]> => {
  const facade = inject<FormGroupFacade<Form>>(FormGroupFacade);

  const optionsOrFactory: PropsWithOptions<Form>['options'] = (
    (injectControlConfig().props ?? { options: [] }) as PropsWithOptions<Form>
  ).options;

  const options = isFactoryFunction(optionsOrFactory) ? optionsOrFactory(facade.form) : optionsOrFactory;

  return asSignal(options, { initialValue: [] });
};
