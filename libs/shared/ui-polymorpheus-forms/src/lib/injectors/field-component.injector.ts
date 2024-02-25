import { Type } from '@angular/core';
import { Observable, from } from 'rxjs';
import { FORM_FIELD_COMPONENTS_MAPPER } from '../mappers';
import { injectControlConfig } from './control-config.injector';

export const injectFieldComponent = (): Observable<Type<unknown>> => {
  const config = injectControlConfig();

  return from(FORM_FIELD_COMPONENTS_MAPPER[config.type]());
};
